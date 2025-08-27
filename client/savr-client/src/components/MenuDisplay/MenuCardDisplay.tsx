import { MenuDisplay } from './MenuDisplay';
import { ShoppingCartProvider } from './ShoppingCartContext';

const MenuCardDisplay = () => {
  return (
    <ShoppingCartProvider>
      <MenuDisplay />
    </ShoppingCartProvider>
  );
};

export { MenuCardDisplay };
