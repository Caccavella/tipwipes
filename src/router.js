import React from 'react';
import { Switch, Route } from 'react-router-dom';

export default (
    <Switch>        
        
        <Route exact path='/'/>
        
        
        
        <Route render={() => {
        return(<div>I'm sorry, the page you're looking for cannot be found. A highly trained monkey is working to build the page as you read this.
        </div>)
    }} />
        
    </Switch>
)