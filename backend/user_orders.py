from flask import Blueprint, jsonify, request, session, render_template, url_for
from db import get_psql_conn
import datetime
user_orders = Blueprint("user_orders", __name__)

# return cloth name, price, image url, cloth_id, color
@user_orders.route('/user_orders_load_orders', methods=['GET'])
def user_orders_load_orders():
    psql_conn = get_psql_conn()
    if psql_conn is not None:
        cur = psql_conn.cursor()
    else:
        print("Failed to connect to the database.")
    user_id = request.args.get('user_id')
    status = request.args.get('status')
    
    try:
        cur.execute(
            '''
            SELECT o.order_id, o.sub_total, o.shipping_fee, o.payment_type, o.address, o.order_date, o.ideal_rcv_date, oc.color, oc.size, oc.purchase_qty, c.name, c.price, c.description, i.path
            FROM public."order" AS o
            JOIN public."order_contains" AS oc ON o.order_id = oc.order_id
            JOIN public."order_status_record" AS osr ON o.order_id = osr.order_id
            JOIN public."clothes" AS c ON oc.clothes_id = c.clothes_id
            JOIN public."clothes_color" AS cc ON oc.clothes_id = cc.clothes_id AND oc.color = cc.color
            JOIN public."image" AS i ON cc.image_filename = i.filename
            WHERE o.user_id = %s AND osr.status = %s;
            ''',
            (user_id, status)
        )

        all_order_data = cur.fetchall()
        update_all_order_data = []
        for order in all_order_data:
            new_cloth = {
                "order_id": order[0], 
                "sub_total": order[1], 
                "shipping_fee": order[2], 
                "payment_type": order[3], 
                "address": order[4], 
                "order_date": order[5].strftime('%Y-%m-%d'), 
                "ideal_rcv_date": order[6].strftime('%Y-%m-%d'), 
                "color": order[7], 
                "size": order[8],
                "purchase_qty": order[9],
                "name": order[10],
                "price": order[11], 
                "description": order[12], 
                "path": url_for("static", filename='images/' + order[13])
            }
            update_all_order_data.append(new_cloth)
        # print(update_all_clothes_in_bag_data)
        psql_conn.commit()
        return jsonify(update_all_order_data), 200
    except Exception as e:
        psql_conn.rollback()
        print("An error occurred. Transaction rolled back.")
        print("Error details:", e)
        return jsonify({"error": str(e)}), 500