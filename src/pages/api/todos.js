let todos = [
    { id: '1', title: 'Learn Next.js', description: 'Study API routes', status: false },
    { id: '2', title: 'Build Todo App', description: 'Create a simple todo app with CRUD features', status: false },
    { id: '3', title: 'Deploy to Vercel', description: 'Deploy Next.js app to Vercel', status: false },
  ];
  
  export default function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
  
    switch (method) {
      case 'GET':
        // Get all todos
        res.status(200).json(todos);
        break;
  
      case 'POST':
        // Add a new todo
        const newTodo = {
          id: Date.now().toString(),
          title: req.body.title,
          description: req.body.description,
          status: false,
        };
        todos.push(newTodo);
        res.status(201).json(newTodo);
        break;
  
      case 'DELETE':
        // Delete a todo by id
        todos = todos.filter((todo) => todo.id !== id);
        res.status(200).json({ message: `Todo with id ${id} deleted.` });
        break;
  
      case 'PUT':
        // Update a todo by id
        const todoIndex = todos.findIndex((todo) => todo.id === id);
        if (todoIndex !== -1) {
          todos[todoIndex] = {
            ...todos[todoIndex],
            title: req.body.title || todos[todoIndex].title,
            description: req.body.description || todos[todoIndex].description,
            status: req.body.status !== undefined ? req.body.status : todos[todoIndex].status,
          };
          res.status(200).json(todos[todoIndex]);
        } else {
          res.status(404).json({ message: 'Todo not found' });
        }
        break;
  
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  }
  