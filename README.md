SmartCodeDocs : An AI-Powered Code Documentation Generator
SmartCodeDocs AI is a web application designed to automatically generate clear and concise documentation for source code snippets. By leveraging a powerful AI model, this tool assists developers in creating high-quality documentation with minimal effort.

Key Features
AI-Powered Analysis: Utilizes an advanced large language model to provide human-like explanations of your code's functionality.

Multi-Language Support: Provides tailored parsing for Python and offers robust documentation for other languages including C++, C, Java, and JavaScript.

Customizable Documentation Styles: Users can select from various output formats, including a simple, direct explanation or professional styles like Google Style and JSDoc.

Professional User Interface: Features a clean, dark-themed interface designed for developer productivity and comfort.

Persistent History: Allows users to save generated documents to their browser's local storage for future reference.

Downloadable Output: Any generated documentation can be downloaded as a standard Markdown (.md) file.

Responsive Design: Built as a single-page application (SPA) for a smooth and consistent experience across all devices.

Tech Stack
Backend
Framework: Flask

Language: Python

AI Service: Google AI Platform

Libraries: google-generativeai, Flask-Cors, python-dotenv

Frontend
Core Technologies: HTML5, CSS3, JavaScript (ES6+)

Development Server: VS Code Live Server

Getting Started
Follow these instructions to set up a local instance of the project for development and testing.

Prerequisites
Python 3.9+

Visual Studio Code with the "Live Server" extension.

A Google AI Platform API Key. Keys can be obtained from Google AI Studio.

Backend Setup
Clone the repository:

git clone [https://github.com/vaishnavi7106/SmartCodeDocs.git](https://github.com/vaishnavi7106/SmartCodeDocs.git)
cd SmartCodeDocs/backend

Create and activate a virtual environment:

# Create the environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on macOS/Linux
source venv/bin/activate

Install the required packages:

pip install -r requirements.txt

Configure your environment file:

Create a new file named .env in the backend directory.

Add your API key to this file as follows:

GOOGLE_API_KEY="YOUR_SECRET_API_KEY_HERE"

Run the Flask server:

python app.py

The backend will now be running on http://127.0.0.1:5000.

Frontend Setup
Open the project's root folder in Visual Studio Code.

Navigate to the frontend directory in the VS Code explorer.

Right-click on the index.html file and select "Open with Live Server".

Your browser will open a new tab with the application ready to use.

Usage
Input Code: Paste a code snippet into the provided text area.

Select Options: Choose the source language and desired documentation style.

Generate: Click the "Generate" button to process the code.

View & Save: The application will display the generated documentation. You can then download the document or save it to your local history.

Review History: Click the "History" link in the navigation bar to access all previously saved documents.

