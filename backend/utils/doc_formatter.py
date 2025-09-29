def format_documentation(documented_elements):
    """
    Assembles the generated documentation pieces into a single Markdown string.
    """
    if not documented_elements:
        return "No documentation was generated."

    # Start the final document with a main title.
    markdown_output = "# AI-Generated Code Documentation\n\n"
    
    for element in documented_elements:
        filename = element.get('filename', 'Pasted Code')
        element_type = element.get('type', 'Code Block').capitalize()
        element_name = element.get('name', '')
        documentation = element.get('documentation', 'No documentation available.')
        
        # This logic creates a clean heading for each code block.
        # If it's a whole file, it just says "File: ...".
        # If it's a function/class, it says "Function: my_func".
        heading = f"## {element_type}: `{element_name}`" if element_name != filename else f"## File: `{filename}`"
        
        markdown_output += f"{heading}\n\n"
        
        # Add the AI-generated documentation.
        markdown_output += f"{documentation}\n\n"
        
        # Add a horizontal line to separate different documentation blocks.
        markdown_output += "---\n\n"
        
    return markdown_output