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

const baseEndpoint = 'https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=5';

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
        <Downshift itemToString={item => `${item.name} (${item.countryIso.toUpperCase()})`}>
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
              <div {...css({ position: 'relative', maxWidth: 500, margin: '0 auto' })}>
                <h1>Where are you going?</h1>
                <Label {...getLabelProps()}>Pick-up Location</Label>
                <div {...css({ position: 'relative' })}>
                  <Input
                    {...getInputProps({
                      isOpen,
                      placeholder: 'city, airport, station, region, district...',
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
                        {({ loading, error, data = [] }) => {
                          if (loading) {
                            return <Item disabled>Loading...</Item>;
                          }

                          if (error) {
                            return <Item disabled>Error! ${error}</Item>;
                          }

                          if (!data.length) {
                            return <Item disabled>No Locations found</Item>;
                          }

                          return data.map((item, index) => (
                            <Item
                              key={item.bookingId}
                              {...getItemProps({
                                item,
                                index,
                                isActive: highlightedIndex === index,
                                isSelected: selectedItem === item,
                              })}
                            >
                              <p>{item.name && item.name} {item.countryIso && `(${item.countryIso.toUpperCase()})`}</p>
                              {item.region || item.country ? (
                                <p>
                                  {item.region && <span>{item.region}, </span>}
                                  {item.country && <span>{item.country}</span>}
                                </p>
                              ) : null}
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
