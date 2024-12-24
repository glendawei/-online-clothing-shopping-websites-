from flask import Blueprint, jsonify, request, session, render_template, url_for
from db import get_psql_conn


item = Blueprint("item", __name__)


@item.post('/add-to-bag')
def add_item_to_bag():
    user_id = session.get("user_id")
    clothes_id = request.json['clothes_id']
    color = request.json['color']
    size = request.json['size']
    quantity = int(request.json['quantity'])
    
    try:
        cur = get_psql_conn().cursor()
        cur.execute("""
            SELECT user_id
            FROM BAG
            WHERE user_id = %s AND clothes_id = %s AND color = %s AND size = %s
            FOR UPDATE
        """, [user_id, clothes_id, color, size])
        if len(cur.fetchall()):  # duplicate BAG entry
            get_psql_conn().rollback()
            return jsonify({"success": -1}), 200
        
        cur.execute("""
            SELECT stock_qty
            FROM CLOTHES_COLOR_SIZE
            WHERE clothes_id = %s AND color = %s AND size = %s
        """, [clothes_id, color, size])
        remaining_qty = cur.fetchone()[0]
        if remaining_qty < quantity:  # duplicate BAG entry
            get_psql_conn().rollback()
            return jsonify({"success": -2, "quantity": remaining_qty}), 200
        
        cur.execute("""
            INSERT INTO BAG
            VALUES(%s, %s, %s, %s, %s)
        """, [user_id, clothes_id, color, size, quantity])
        get_psql_conn().commit()
        
        return jsonify({"success": 0}), 200
    except Exception as e:
        get_psql_conn().rollback()
        return jsonify({"error": str(e)}), 500
    

@item.post('/add-to-favorite')
def add_item_to_favorite():
    user_id = session.get("user_id")
    clothes_id = request.json['clothes_id']
    color = request.json['color']
    print(user_id)
    print(clothes_id)
    print(color)
    
    
    try:
        cur = get_psql_conn().cursor()
        cur.execute("""
            SELECT user_id
            FROM FAVORITE
            WHERE user_id = %s AND clothes_id = %s AND color = %s
            FOR UPDATE
        """, [user_id, clothes_id, color])
        if len(cur.fetchall()):  # duplicate FAVORITE entry
            get_psql_conn().rollback()
            return jsonify({"success": -1}), 200
        
        cur.execute("""
            INSERT INTO FAVORITE
            VALUES(%s, %s, %s)
        """, [user_id, clothes_id, color])
        get_psql_conn().commit()
        
        return jsonify({"success": 0}), 200
    except Exception as e:
        get_psql_conn().rollback()
        return jsonify({"error": str(e)}), 500


@item.post('/get-clothes-colors-descr')
def get_clothes_colors():
    clothes_id = request.json['clothes_id']
    
    try:
        cur = get_psql_conn().cursor()
        cur.execute("""
            SELECT color
            FROM CLOTHES_COLOR
            WHERE clothes_id = %s
        """, [clothes_id])
        get_psql_conn().commit()
        colors = cur.fetchall()
        
        cur.execute("""
            SELECT description
            FROM CLOTHES
            WHERE clothes_id = %s
        """, [clothes_id])
        get_psql_conn().commit()
        descr = cur.fetchone()[0]
        
        return jsonify({"colors": colors,
                            "descr": descr}), 200
    except Exception as e:
        get_psql_conn().rollback()
        return jsonify({"error": str(e)}), 500

    
@item.post('/change-clothes-image')
def get_clothes_color_image():
    clothes_id = request.json['clothes_id']
    color = request.json['color']
    
    try:
        cur = get_psql_conn().cursor()
        cur.execute("""
            SELECT path
            FROM CLOTHES_COLOR AS CC
                JOIN IMAGE AS I ON CC.image_filename = I.filename
            WHERE clothes_id = %s AND color = %s
        """, [clothes_id, color])
        get_psql_conn().commit()
        
        image_src = cur.fetchone()[0]
        image_src = url_for("static", filename=f"images/{image_src}")
        return jsonify({"image_src": image_src}), 200
    except Exception as e:
        get_psql_conn().rollback()
        return jsonify({"error": str(e)}), 500


@item.post('/get-clothes-sizes')
def get_clothes_sizes():
    clothes_id = request.json['clothes_id']
    color = request.json['color']
    
    try:
        cur = get_psql_conn().cursor()
        cur.execute("""
            SELECT size
            FROM CLOTHES_COLOR_SIZE
            WHERE clothes_id = %s AND color = %s
        """, [clothes_id, color])
        get_psql_conn().commit()
        
        size_order = dict(zip(["XS", "S", "M", "L", "XL"],
                              [1, 2, 3, 4, 5]))
        sizes = [s[0] for s in cur.fetchall()]
        sizes = sorted(sizes, key=lambda s: size_order[s])
        return jsonify({"sizes": sizes}), 200
    except Exception as e:
        get_psql_conn().rollback()
        return jsonify({"error": str(e)}), 500