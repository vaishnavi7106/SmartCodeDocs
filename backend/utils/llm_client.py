import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

model = None
try:
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise EnvironmentError("FATAL: GOOGLE_API_KEY not found in your .env file.")
    
    genai.configure(api_key=api_key)
    
    # THE FIX IS HERE: We are changing the model name to the correct, modern version.
    model = genai.GenerativeModel('gemini-1.5-flash-latest')

except Exception as e:
    print(f"Error configuring the Gemini model: {e}")

def generate_documentation(code_elements, style='simple'):
    if not model:
        raise EnvironmentError("The Gemini AI model is not initialized. Please check your API key and server logs.")

    documented_elements = []
    for element in code_elements:
        prompt = f"""
        You are an expert technical writer, skilled at making complex code easy to understand.
        Your task is to write a simple, clear, and concise explanation for the following code snippet.
        Imagine you are explaining it to a student or a junior developer.

        The documentation style requested is: **{style} Style**.

        If the style is "Simple Explanation", please provide:
        1. A one-sentence summary of what the code does.
        2. A short paragraph explaining its purpose and how it works.
        3. A simple breakdown of its inputs (arguments) and its main output (return value).

        IMPORTANT: Do NOT repeat the code itself in your output. Only provide the documentation content.

        Here is the code for the '{element['name']}':
        ```
        {element['code_block']}
        ```
        """
        try:
            response = model.generate_content(prompt)
            element['documentation'] = response.text.strip()
        except Exception as e:
            print(f"An error occurred calling the Gemini API: {e}")
            element['documentation'] = f"Error: Could not generate documentation from the AI. Details: {e}"
        
        documented_elements.append(element)
        
    return documented_elements