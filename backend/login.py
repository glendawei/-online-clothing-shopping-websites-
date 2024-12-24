from flask import Blueprint, jsonify, request, session, render_template
from db import get_psql_conn


login = Blueprint("login", __name__)

@login.post('/submit_login')
def handle_login():
    # check email or phone
    accountInput = request.json['email_or_phone']
    password = request.json['user_password']
    cmd = """"""
    
    # phone num
    if accountInput.isdigit():
        cmd = """
        SELECT user_id, fname, lname, phone, email, bdate, gender
        FROM "user"
        WHERE phone = %s AND password = %s
        """

    else:
        cmd = """
        SELECT user_id, fname, lname, phone, email, bdate, gender
        FROM "user"
        WHERE email = %s AND password = %s
        """
    
    cur = get_psql_conn().cursor()
    cur.execute(cmd, [accountInput, password])
    get_psql_conn().commit()
    rows = cur.fetchall()
    
    # get no user
    if len(rows):
        session["login"] = True
        session["user_id"] = rows[0][0]
        session["user_fname"] = rows[0][1]
        session["user_lname"] = rows[0][2]
        session["phone"] = rows[0][3]
        session["email"] = rows[0][4]
        session["bdate"] = rows[0][5]
        session["gender"] = rows[0][6]
        return jsonify({'success': 1, 'session': dict(session)})
    else:
        return jsonify({'success': 0, 'error': 'Wrong account or password.'})
    
