from flask import Blueprint, jsonify, request, session, render_template, url_for
from db import get_psql_conn

bag = Blueprint("bag", __name__)

# return cloth name, price, image url, cloth_id, color
@bag.route('/bag_load_bag', methods=['GET'])
def bag_load_bag():
    psql_conn = get_psql_conn()
    if psql_conn is not None:
        cur = psql_conn.cursor()
    else:
        print("Failed to connect to the database.")
    user_id = request.args.get('user_id')
    
    try:
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
    except Exception as e:
        psql_conn.rollback()
        print("An error occurred. Transaction rolled back.")
        print("Error details:", e)
        return jsonify({"error": str(e)}), 500

@bag.route('/bag_delete_item', methods=['POST'])
def bag_delete_item():
    psql_conn = get_psql_conn()
    if psql_conn is not None:
        cur = psql_conn.cursor()
    else:
        print("Failed to connect to the database.")

    data = request.json
    user_id = data.get('user_id')
    clothes_id = data.get('clothes_id')
    color = data.get('color')
    size = data.get('size')
    
    try:
        cur.execute(
            '''
            DELETE FROM bag 
            WHERE user_id = %s AND clothes_id = %s AND color = %s AND "size" = %s;
            ''',
            (user_id, clothes_id, color, size)
        )

        psql_conn.commit()
        return jsonify({"message": "successfully deleted!"}), 200
    except Exception as e:
        get_psql_conn().rollback()
        return jsonify({"error": str(e)}), 500