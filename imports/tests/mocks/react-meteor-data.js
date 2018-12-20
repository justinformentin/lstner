//https://stackoverflow.com/questions/47626367/jest-testing-meteor-react-component-which-is-using-withtracker-in-container-met

const createContainer = jest.fn((options = {}, component) => component);

export const withTracker = jest.fn(Op => jest.fn(C => createContainer(Op, C)));
