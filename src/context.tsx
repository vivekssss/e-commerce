import React, { createContext } from 'react';
import { cartStore } from './store';

export const StoreContext = createContext(cartStore);

export class StoreProvider extends React.Component<{ children: React.ReactNode }> {
  render() {
    return (
      <StoreContext.Provider value={cartStore}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}
