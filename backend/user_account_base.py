# from flask import Blueprint, jsonify, request, session, render_template, url_for
# from db import get_psql_conn

# user_account_base = Blueprint("user_account_base", __name__)

# # return cloth name, price, image url, cloth_id, color
# @user_account_base.route('/user_account_base_load_user_data', methods=['GET'])
# def user_account_base_load_user_data():
#     psql_conn = get_psql_conn()
#     if psql_conn is not None:
#         cur = psql_conn.cursor()
#     else:
#         print("Failed to connect to the database.")

#     user_id = request.args.get('user_id')

#     cur.execute(
#         '''
#         SELECT u.fname, u.lname, i.path, ui.upload_date
#         FROM user_image AS ui
#         JOIN "user" AS u ON ui.user_id = u.user_id
#         JOIN image AS i ON ui.image_filename = i.filename
#         WHERE ui.user_id = %s
#         ORDER BY ui.upload_date DESC
#         LIMIT 1;
#         ''',
#         (user_id)
#     )

#     user_data = cur.fetchone()
#     new_user_data = list(user_data)
#     new_user_data[2] = url_for("static", filename='/images/' + user_data[2])

#     psql_conn.commit()
#     return jsonify({
#         "fname": new_user_data[0],
#         "lname": new_user_data[1], 
#         "img": new_user_data[2]
#     }), 200