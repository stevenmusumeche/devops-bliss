const initialState = {
  active: {}
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "START_EXPERIMENT":
      let { name, variant } = payload;
      let active = { ...state.active, [name]: variant };

      return {
        active
      };
    default:
      return state;
  }
};

export function startExperiment({ name, variant }) {
  return {
    type: "START_EXPERIMENT",
    payload: {
      name,
      variant
    },
    meta: {
      analytics: {
        event: `${name} Experiment Played`,
        value: variant
      }
    }
  };
}
