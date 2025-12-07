import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import DictionaryPage from './pages/DictionaryPage';
import QuizPage from './pages/QuizPage';
import HistoryPage from './pages/HistoryPage';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <DictionaryPage />
        </Route>
        <Route path="/dictionary">
          <Redirect to="/" />
        </Route>
        <Route path="/quiz">
          <QuizPage />
        </Route>
        <Route path="/history">
          <HistoryPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
