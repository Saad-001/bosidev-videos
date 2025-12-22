import "@shopify/ui-extensions/preact";
import { render } from "preact";

import { useBuyerJourneyIntercept } from "@shopify/ui-extensions/checkout/preact";

// 1. Export the extension
export default async () => {
  render(<Extension />, document.body);
};

function hasNumber(str) {
  return /\d/.test(str);
}

function Extension() {
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (!canBlockProgress) {
      return {
        behavior: "allow",
      };
    }
    const address = shopify.shippingAddress.value.address1;
    const addressHasNumber = hasNumber(address);

    if (addressHasNumber) {
      return {
        behavior: "allow",
      };
    } else {
      return {
        behavior: "block",
        reason: "Invalid shipping address",
        errors: [
          {
            message: shopify.i18n.translate('shippingError'),
            target: "$.cart.deliveryGroups[0].deliveryAddress.address1",
          },
        ],
      };
    }
  });

  return null;
}
