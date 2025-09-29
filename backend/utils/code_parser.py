import ast

def parse_code(code_content, filename):
    """
    Parses code content to extract logical blocks for documentation.
    """
    if not code_content.strip():
        # If the pasted code is empty, return nothing.
        return []

    extension = filename.rsplit('.', 1)[-1].lower()
    
    # Use the advanced Abstract Syntax Tree parser for Python
    if extension == 'py':
        elements = _parse_python(code_content, filename)
    else:
        # For all other languages (JS, Java, C, C++), we will use a simpler,
        # more reliable approach of documenting the entire snippet as one file.
        elements = [{
            'filename': filename,
            'type': 'file',
            'name': filename,
            'code_block': code_content
        }]
    
    # This is a critical safety net. If for any reason the parser finds
    # nothing, we ALWAYS fall back to documenting the whole snippet.
    # This prevents the "Could not parse" error.
    if not elements and code_content.strip():
        return [{
            'filename': filename,
            'type': 'file',
            'name': filename,
            'code_block': code_content
        }]
        
    return elements

def _parse_python(code_content, filename):
    """
    Uses Python's built-in AST library to safely find functions and classes.
    """
    elements = []
    try:
        tree = ast.parse(code_content)
        for node in ast.walk(tree):
            # Check for functions, async functions, and classes
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                element_type = 'class' if isinstance(node, ast.ClassDef) else 'function'
                elements.append({
                    'filename': filename,
                    'type': element_type,
                    'name': node.name,
                    # This gets the exact source code for just that function/class
                    'code_block': ast.get_source_segment(code_content, node)
                })
    except SyntaxError:
        # If the Python code has a syntax error, we don't try to parse it.
        # The safety net above will handle it.
        pass
    return elements