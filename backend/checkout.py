from flask import Blueprint, jsonify, request, session, render_template, url_for
from db import get_psql_conn

checkout = Blueprint("checkout", __name__)

# return cloth name, price, image url, cloth_id, color
@checkout.route('/checkout_load_bag', methods=['GET'])
def checkout_load_bag():
    psql_conn = get_psql_conn()
    if psql_conn is not None:
        cur = psql_conn.cursor()
    else:
        print("Failed to connect to the database.")

    user_id = request.args.get('user_id')

    cur.execute(
        '''
        SELECT cl.clothes_id, cl.name, cl.part, cl.gender, cl.price, cl.description, cc.color, bag.size, i.path, bag.purchase_qty
        FROM clothes AS cl
        JOIN clothes_color AS cc ON cl.clothes_id = cc.clothes_id
        JOIN image AS i ON cc.image_filename = i.filename
        JOIN bag ON cc.clothes_id = bag.clothes_id AND cc.color = bag.color
        WHERE bag.user_id = %s
        ''',
        (user_id,)
    )

    all_clothes_in_bag_data = cur.fetchall()
    update_all_clothes_in_bag_data = []
    for cloth in all_clothes_in_bag_data:
        new_cloth = {
            "id": cloth[0], 
            "name": cloth[1], 
            "part": cloth[2], 
            "gender": cloth[3], 
            "price": cloth[4], 
            "description": cloth[5], 
            "color": cloth[6], 
            "size": cloth[7], 
            "img": url_for("static", filename='images/' + cloth[8]),
            "quantity": cloth[9]
        }
        update_all_clothes_in_bag_data.append(new_cloth)
    # print(update_all_clothes_in_bag_data)
    psql_conn.commit()
    return jsonify(update_all_clothes_in_bag_data), 200

@checkout.route('/checkout_', methods=['POST'])
def checkout_():
    psql_conn = get_psql_conn()
    if psql_conn is not None:
        cur = psql_conn.cursor()
    else:
        print("Failed to connect to the database.")

    data = request.json
    user_id = data.get('user_id')
    sub_total = data.get('sub_total')
    shipping_fee = data.get('shipping_fee')
    payment_type = data.get('payment_type')
    if payment_type == 'Visa':
        payment_type = 'V'
    elif payment_type == 'MasterCard':
        payment_type = 'M'
    elif payment_type == 'PayPal':
        payment_type = 'P'

    address = data.get('address')

    
    try:
        cur.execute(
            """
            SELECT bag.clothes_id
            FROM bag
            WHERE bag.user_id = %s FOR UPDATE
            """,
            (user_id,)
        )
        if cur.fetchone() is None:
            # If there are rows in `insufficient_stock`, rollback the transaction
            raise Exception("No item in your bag.")

        # get items in "bag" and add them into "order_contains", then delete them from "bag"
        cur.execute(
            """
            WITH moved_data AS (
                SELECT bag.clothes_id, bag.color, bag.size, bag.purchase_qty
                FROM bag
                WHERE bag.user_id = %s FOR UPDATE
            ),
            insufficient_stock AS (
                SELECT ccs.clothes_id, ccs.color, ccs.size
                FROM public."clothes_color_size" ccs
                JOIN moved_data ON ccs.clothes_id = moved_data.clothes_id 
                    AND ccs.color = moved_data.color 
                    AND ccs.size = moved_data.size
                WHERE ccs.stock_qty < moved_data.purchase_qty
            )

            SELECT 1
            FROM insufficient_stock
            LIMIT 1;
            """,
            (user_id,)
        )

        if cur.fetchone() is not None:
            # If there are rows in `insufficient_stock`, rollback the transaction
            raise Exception("Insufficient stock for one or more items.")
        
        # add the order into "order", assume order_id will add by dbms
        cur.execute(
            """
            INSERT INTO public."order" (user_id, sub_total, shipping_fee, payment_type, address, order_date, ideal_rcv_date)
            VALUES (%s, %s, %s, %s, %s, NOW(), NOW() + INTERVAL '3 days')
            RETURNING order_id
            """,
            (user_id, sub_total, shipping_fee, payment_type, address)
        )
        order_id = cur.fetchone()[0]

        cur.execute(
            """
            INSERT INTO public."order_status_record" (order_id, status, status_date, status_description)
            VALUES (%s, %s, NOW(), %s)
            RETURNING order_id
            """,
            (order_id, 'p', "In Progress")
        )

        cur.execute(
            """
            WITH moved_data AS (
                SELECT bag.clothes_id, bag.color, bag.size, bag.purchase_qty
                FROM bag
                WHERE bag.user_id = %s
            )
            UPDATE public."clothes_color_size"
            SET stock_qty = stock_qty - moved_data.purchase_qty
            FROM moved_data
            WHERE public."clothes_color_size".clothes_id = moved_data.clothes_id
            AND public."clothes_color_size".color = moved_data.color
            AND public."clothes_color_size".size = moved_data.size
            """,
            (user_id,)
        )

        cur.execute(
            """
            WITH moved_data AS (
                SELECT bag.clothes_id, bag.color, bag.size, bag.purchase_qty
                FROM bag
                WHERE bag.user_id = %s
            )
            INSERT INTO public."order_contains" (order_id, clothes_id, color, "size", purchase_qty)
            SELECT %s, clothes_id, color, "size", purchase_qty
            FROM moved_data;
            """,
            (user_id, order_id)
        )

        cur.execute(
            """
            DELETE FROM bag
            WHERE user_id = %s;
            """,
            (user_id,)
        )

        psql_conn.commit()
        return jsonify({"order_id": order_id}), 200
    
    except Exception as e:
        # Rollback the transaction in case of errors
        psql_conn.rollback()
        return jsonify({"error": f"{e}"}), 500
    
    