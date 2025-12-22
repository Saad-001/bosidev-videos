import "@shopify/ui-extensions/preact";
import { render } from "preact";

import { useAppMetafields } from "@shopify/ui-extensions/checkout/preact";
import { useEffect, useState } from "preact/hooks";

// 1. Export the extension
export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const [metafieldData] = useAppMetafields({
    namespace: "custom",
    key: "checkout_upsell",
    type: "shop",
  });

  const [productData, setProductData] = useState(null);
  const upsellProductId = metafieldData?.metafield?.value
  const itemAlreadyInCart = shopify.lines.value.some((line) => {
    return line.merchandise.product.id === upsellProductId
  })

  useEffect(() => {
    shopify
      .query(
        `query GetProduct($id: ID!) {
            product(id: $id) {
              id
              title
              featuredImage {
                url
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount

                    }
                    image {
                      url
                    }
                  }
                }
              }
            }
          }`,
        { variables: { id: upsellProductId } }
      )
      .then(({ data, errors }) => setProductData(data))
      .catch(console.error);
  }, [upsellProductId]);

  if (!productData || itemAlreadyInCart) {
    return null;
  }

  const variantData = productData.product.variants.edges[0].node

  async function handleClick() {
    const response = await shopify.applyCartLinesChange(
      {
        type: "addCartLine",
        merchandiseId: variantData.id,
        quantity: 1
      }
    )
  }

  return (
    <s-box background="subdued" padding="base">
      <s-stack gap="base">
        <s-grid gap="base">
          <s-grid-item>
            <s-grid gridTemplateColumns="25% 75%" gap="base">
              <s-grid-item>
                {variantData.image.url && (
                  <s-image src={variantData.image.url}></s-image>
                )}
              </s-grid-item>
              <s-grid-item>
                <s-heading>{variantData.title}</s-heading>
                <s-paragraph>
                  {shopify.i18n.formatCurrency(variantData.price.amount)}
                </s-paragraph>
              </s-grid-item>
            </s-grid>
          </s-grid-item>

          <s-grid-item>
            <s-button variant="primary" onClick={handleClick}>
              {shopify.i18n.translate("addToCart")}
            </s-button>
          </s-grid-item>
        </s-grid>
      </s-stack>
    </s-box>
  );
}
