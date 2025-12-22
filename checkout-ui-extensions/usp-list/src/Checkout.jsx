import "@shopify/ui-extensions/preact";
import { render } from "preact";

// 1. Export the extension
export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  return (
    <s-stack direction="inline" gap="base">
      {[1, 2, 3].map((i) => {
        const heading = shopify.settings.value["usp_heading_" + i];
        const text = shopify.settings.value["usp_text_" + i];
        const image = shopify.settings.value["usp_image_" + i];

        if (heading || text || image) {
          return (
            <s-grid gridTemplateColumns="20% 80%" gap="base" inlineSize="100%" alignItems="center">
              <s-grid-item blockSize="auto">
                <s-image src={image.toString()}></s-image>
              </s-grid-item>
              <s-grid-item blockSize="auto">
                <s-heading>{heading}</s-heading>
                <s-paragraph>{text}</s-paragraph>
              </s-grid-item>
            </s-grid>
          );
        }
        return null;
      })}
    </s-stack>
  );
}
