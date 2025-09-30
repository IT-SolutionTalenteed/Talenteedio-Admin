import { onBeforeUnmount } from 'vue';

export default (args: any) => {
  return new Promise((resolve) => {
    const { loadtime, src, attr, notRemoveOnUnmount } = args;

    if (loadtime && loadtime === 'once' && document.querySelector(`[src="${src}"]`)) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');

    script.setAttribute('src', src);

    script.onload = () => {
      resolve(true);
    };

    if (attr) {
      for (const key in attr) {
        if (Object.prototype.hasOwnProperty.call(attr, key)) {
          script.setAttribute(key, attr[key]);
        }
      }
    }

    document.body.appendChild(script);

    onBeforeUnmount(() => {
      if (notRemoveOnUnmount && document.querySelector(`[src="${src}"]`)) {
        return;
      }

      script.remove();
    });
  });
};
