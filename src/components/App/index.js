import React, { Component } from 'react';
import Downshift from 'downshift';
import {
  Label,
  Menu,
  Input,
  Item,
  css,
} from '../../util';
import Axios from '../Axios';
            
// 

const baseEndpoint =  'https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=5';

class App extends Component {
  render() {
    return (
      <div
        {...css({
          display: 'flex',
          flexDirection: 'column',
          marginTop: 50,
        })}
      >
        <Downshift>
          {({
            inputValue,
            getInputProps,
            getLabelProps,
            getMenuProps,
            getItemProps,
            selectedItem,
            highlightedIndex,
            isOpen,
          }) => (
            <div {...css({ width: 250, margin: 'auto', position: 'relative' })}>
              <Label {...getLabelProps()}>Select a Github repository</Label>
              <div {...css({ position: 'relative' })}>
                <Input
                  {...getInputProps({
                    isOpen,
                    placeholder: 'Search repository',
                  })}
                />
                
              </div>
              <Menu {...getMenuProps({ isOpen })}>
                {(() => {
                  if (!isOpen) {
                    return null;
                  }

                  if (!inputValue) {
                    return (
                      <Item disabled>You have to enter a search query</Item>
                    );
                  }

                  return (
                    <Axios url={`${baseEndpoint}&solrTerm="${inputValue}"`}>
                      {({ loading, error, data: { items = [] } = {} }) => {
                        if (loading) {
                          return <Item disabled>Loading...</Item>;
                        }

                        if (error) {
                          return <Item disabled>Error! ${error}</Item>;
                        }

                        if (!items.length) {
                          return <Item disabled>No repositories found</Item>;
                        }

                        return items.map(({ id, name: item }, index) => (
                          <Item
                            key={id}
                            {...getItemProps({
                              item,
                              index,
                              isActive: highlightedIndex === index,
                              isSelected: selectedItem === item,
                            })}
                          >
                            {item}
                          </Item>
                        ));
                      }}
                    </Axios>
                  );
                })()}
              </Menu>
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

export default App;
