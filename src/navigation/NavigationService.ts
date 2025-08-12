import { CommonActions } from "@react-navigation/native";

let navigationRef: any = null;

export default {
  setNavigator: (ref: any) => {
    navigationRef = ref;
  },
  navigate: (name: string, params?: any) => {
    if (navigationRef) {
      navigationRef.navigate(name, params);
    }
  },
  reset: (routes: { name: string }[], index = 0) => {
    if (navigationRef) {
      navigationRef.dispatch(
        CommonActions.reset({
          index,
          routes,
        })
      );
    }
  },
  goBack: () => {
    if (navigationRef && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  },
};
