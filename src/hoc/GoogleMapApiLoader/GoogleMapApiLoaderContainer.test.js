import React from 'react';
import { shallow } from 'enzyme';
import loadjs from 'loadjs';
import GoogleMapApiLoaderContainer from './GoogleMapApiLoaderContainer';

jest.mock('loadjs', () =>
      jest.fn((_, options) => {
            options.success();
      }),
);

jest.mock('../../config', () => ({
      googleMapApi: {
            url: 'gma-url',
            version: 'gma-version',
      },
}));

// mock widow object
global.google = { maps: { gogleMap: 'api' } };

describe('(Container) GoogleMapApiLoader', () => {
      let props;
      let wrapper;
      let Component;

      beforeEach(() => {
            Component = () => <div />;
            const WrappedComponent = GoogleMapApiLoaderContainer(Component);
            props = { random: 'prop' };
            wrapper = shallow(<WrappedComponent {...props} />);
      });

      it('Displays a GoogleMapApiLoader component', () => {
            expect(wrapper.find(Component).length).toEqual(1);
      });

      // Component prop: random
      it('Passes its props to wrapped component', () => {
            expect(wrapper.find(Component).props().random).toEqual('prop');
      });

      // Component prop: googleMap
      it('Passes googleMap to the wrapped component', () => {
            const { googleMap } = wrapper.find(Component).props();
            expect(googleMap).toEqual({ gogleMap: 'api' });
            expect(loadjs).toHaveBeenCalledWith(
                  'gma-url?key=MY_GOOGLE_API_KEY&v=gma-version&libraries=places',
                  expect.objectContaining({
                        success: expect.any(Function),
                        error: expect.any(Function),
                  }),
            );
      });
});
