from flask import Blueprint, jsonify, request, session, render_template, url_for
from db import get_psql_conn
import datetime

user_details = Blueprint("user_details", __name__)

# return cloth name, price, image url, cloth_id, color
@user_details.route('/user_details_load_user_data', methods=['GET'])
def user_details_load_user_data():
    psql_conn = get_psql_conn()
    if psql_conn is not None:
        cur = psql_conn.cursor()
    else:
        print("Failed to connect to the database.")

    user_id = request.args.get('user_id')

    cur.execute(
        '''
        SELECT u.fname, u.lname, u.phone, u.email, u.bdate, u.gender
        FROM public."user" AS u
        WHERE u.user_id = %s
        LIMIT 1;
        ''',
        (user_id,)
    )

    user_data = cur.fetchone()
    print(user_data)
    psql_conn.commit()
    return jsonify({
        "fname": user_data[0],
        "lname": user_data[1], 
        "phone": user_data[2],
        "email": user_data[3],
        "bdate": user_data[4].strftime('%Y-%m-%d'),
        "gender": 'male' if user_data[5] in ('M', 'm') else 'female' if user_data[5] in ('F', 'f') else 'other'
    }), 200

@user_details.route('/user_details_change_user_data', methods=['POST'])
def user_details_change_user_data():
    psql_conn = get_psql_conn()
    if psql_conn is not None:
        cur = psql_conn.cursor()
    else:
        print("Failed to connect to the database.")

    data = request.json
    user_id = data.get('user_id')
    fname = data.get('fname')
    lname = data.get('lname')
    phone = data.get('phone')
    email = data.get('email')
    bir = data.get('bdate')
    gender = data.get('gender').upper()[0]

    try:
        cur.execute(
            """
            UPDATE public."user"
            SET fname = %s, lname = %s, phone = %s, email = %s, bdate = %s, gender = %s
            WHERE user_id = %s
            """,
            (fname, lname, phone, email, bir, gender, user_id)
        )

        psql_conn.commit()
        return jsonify({"message": "successfully changed data!!!!"}), 200
    except Exception as e:
        psql_conn.rollback()
        print("An error occurred. Transaction rolled back.")
        print("Error details:", e)
        return jsonify({"error": str(e)}), 500
    
