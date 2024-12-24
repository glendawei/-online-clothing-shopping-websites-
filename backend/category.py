from flask import Blueprint, jsonify, request, session, render_template, url_for
from db import get_psql_conn

category = Blueprint("category", __name__)

# return cloth name, price, image url, cloth_id, color
@category.route('/category_load_clothes_data', methods=['GET'])
def category_load_clothes_data():
    psql_conn = get_psql_conn()
    if psql_conn is not None:
        cur = psql_conn.cursor()
    else:
        print("Failed to connect to the database.")

    try:
        cur.execute(
            '''
            WITH RankedClothes AS (
                SELECT *,
                    ROW_NUMBER() OVER (PARTITION BY clothes_id ORDER BY clothes_id ASC) AS row_num
                FROM 
                    clothes_color
            )
            SELECT cl.clothes_id, cl.name, cl.part, cl.gender, cl.price, cl.description, rc.color, i.path
            FROM clothes AS cl
            JOIN RankedClothes AS rc ON cl.clothes_id = rc.clothes_id
            JOIN image AS i ON rc.image_filename = i.filename
            WHERE rc.row_num = 1;
            '''
        )

        all_clothes_images = cur.fetchall()
        updated_all_clothes_image = []
        for cloth in all_clothes_images:
            new_cloth = {
                "clothes_id": cloth[0],
                "name": cloth[1],
                "part": cloth[2],
                "gender": cloth[3],
                "price": cloth[4],
                "description": cloth[5],
                "color": cloth[6],
                "img": url_for("static", filename='images/' + cloth[7])
            }
            updated_all_clothes_image.append(new_cloth)
        # print(updated_all_clothes_image)
        psql_conn.commit()
        return jsonify(updated_all_clothes_image), 200
    except Exception as e:
        psql_conn.rollback()
        print("An error occurred. Transaction rolled back.")
        print("Error details:", e)
        return jsonify({"error": str(e)}), 500


