import { Route, Switch } from 'react-router-dom';
import UserProvider from './components/UserProvider';
import routes from './routes';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Switch>
        {routes.map((routeProps, key) => (
          <Route {...routeProps} key={key}/>
        ))}
      </Switch>
    </UserProvider>
  );
}

export default App;
