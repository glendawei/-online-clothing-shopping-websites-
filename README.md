# Introduction
This project is a web application developed by Group B as part of a course at National Taiwan University (NTU). The application is designed to enhance the online shopping experience, with a focus on virtual try-on technology for clothing and accessories. Below are the details of the project's features and architecture.



# Overview
Many shopping platforms today allow consumers to purchase items without having to visit the store in person. However, when it comes to clothing, people often encounter issues where the size of the items they buy does not match their expectations. This platform focuses on enhancing the shopping experience by integrating existing APIs to provide users with virtual try-on technology. This allows customers to preview how clothing, accessories, and other products will look on them in a virtual environment. Customers can use their own photos to simulate the fit and appearance of items and choose the most suitable clothing based on their body shape and preferences. Overall, the platform aims to solve the problem of not being able to try on clothes while shopping online and to enhance the interaction between customers and brands.

# Development Architecture
- **4.1 System Architecture**
  - **Frontend**: The frontend pages and design are created using HTML and CSS, with JavaScript and Flask used for handling API integration.
  - **Backend**: Flask is used to handle API requests and manage the database.
  - **Database**: PostgreSQL is used to store product information and user data.
  - **AI Model**: Based on the Hugging Face API, the system implements virtual clothing try-on effects.
# Feature Introduction

- **User**: Users can log in, register, and manage member information.
  1. **Login**: Users must log in before they can access other shopping features. If the user enters incorrect information or leaves fields empty, relevant prompts will appear to remind them.
  
  2. **Registration**: If the user does not have an account, they can register on the same page as the login.
  
  3. **Member Information Management**: After logging in, users can click on the avatar in the top-left corner to choose options such as logging out, viewing their orders, and editing personal information.

- **Clothing Product Module**: Product display, AI try-on simulation, and shopping cart functionality.
  1. **Product Display**: After clicking the logo to go to the homepage, users can select gender from the navigation bar, and categories of products related to that gender will be displayed. In addition to selecting gender to search for products, users can also directly search for the product they wish to buy.
  
  2. **AI Try-on Simulation**: After selecting a product, the interface provides a try-on feature. The user needs to upload their photo, and the selected product will be fitted onto the image using the AI API. (Note: since the API requires payment, testing may not be directly available after downloading).
  
  3. **Shopping Cart Functionality**: Users can select multiple favorite items to add to the shopping cart and proceed to checkout with a single click.
# Demo

[![Watch the video](https://img.youtube.com/vi/_cj7Jg1OYgw/0.jpg)](https://www.youtube.com/watch?v=_cj7Jg1OYgw)


# Implement
1. **Open a Terminal or Command Prompt**:
   - On Windows, you can use Command Prompt or PowerShell.
   - On macOS or Linux, you can use the terminal.

2. **Navigate to the directory where `app.py` is located**:
   Use the `cd` command to change the directory. For example:
   ```bash
   cd path/to/your/project
   ```

3. **Run the application**:
   Run the Python file by typing the following command:
   ```bash
   python app.py
   ```
   If you are using Python 3 and your system uses `python` for Python 2.x, you may need to use:
   ```bash
   python3 app.py
   ```

4. **Check the output**:
   After running the command, the application should start, and you may see output in the terminal, such as logs from the Flask server if it's a web app. If the app runs a local server, it will likely be accessible in your browser at a specific address (e.g., `http://127.0.0.1:5000/`).

Make sure you have the necessary dependencies installed (like Flask, if you're using it). If not, you can install


