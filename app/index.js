import React from 'react';
import App from './components/App/App';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import NotFound from './components/NotFound/NotFound';
//single page app
const Root = () => (
    <Router>
        <div className="container">
            <Switch>
                <Route exact path="/" component={App} />
                <Route component={NotFound} />
            </Switch>
        </div>
    </Router>
)

render(<Root/>,document.querySelector('#app'));