import { RouteRecordRaw } from 'vue-router';

import { routes } from '@/router';
import type { Menu } from '@/structure';

export const useMenuList = () => {
  return routes2Menus(routes);

  function routes2Menus(routes: RouteRecordRaw[]): Menu[] {
    return routes.reduce<Menu[]>((menuList, route) => {
      if (route.meta?.menu) {
        let menu: Menu | undefined;
        if (typeof route.meta.menu === 'boolean') {
          menu = {
            title: route.name?.toString() ?? '',
            index: route.path,
          };
        } else {
          menu = route.meta.menu;
        }
        if (route.children) {
          menu.children = routes2Menus(route.children);
        }
        menuList.push(menu);
      }
      return menuList;
    }, []);
  }
};

export default useMenuList;
