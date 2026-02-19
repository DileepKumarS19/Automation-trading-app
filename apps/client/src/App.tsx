import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { CreateWorkflow } from './components/CreateWorkflow';
import { Landing }from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import WorkflowDetails from './pages/WorkflowDetail';
import { WorkflowExecutions } from './pages/WorkflowExecutions';


function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/auth' element={<Auth/>}/>
        <Route path='/create-workflow' element={<CreateWorkflow/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/workflow/:id' element={<WorkflowDetails/>} />
        <Route path='/workflow/executions/:id' element={<WorkflowExecutions/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
