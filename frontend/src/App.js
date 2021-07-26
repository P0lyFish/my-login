import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LoginPage } from './features/LoginPage';
import { ChangePassPage } from './features/ChangePassPage';
import { HomePage } from './features/HomePage';

function App() {
  return (
    <div className='jumbotron'>
      <BrowserRouter>
        <Switch> 
          <Route path="/login" component={LoginPage} />
          <Route path="/change-pass" component={ChangePassPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
