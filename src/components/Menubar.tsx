import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./ModeToggle";

export const Menubar = () => {
  return (
    <NavigationMenu className="my-3 md:mb-16 sm:mb-8">
      <NavigationMenuList className="gap-4 md:gap-8 grid grid-cols-[1fr,auto,1fr]">
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/"
            className="hidden md:block text-3xl text-nowrap hover:underline"
          >
            &lt;benedikt.codes /&gt;
          </NavigationMenuLink>
          <NavigationMenuLink
            className="block md:hidden mr-4 text-green-600 dark:text-green-400"
            href="/"
          >
            home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <div className="flex items-center space-x-5 text-green-600 dark:text-green-400">
          <NavigationMenuItem>
            <NavigationMenuLink href="/blog">blog</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">about</NavigationMenuLink>
          </NavigationMenuItem>
        </div>
        <NavigationMenuItem className="flex justify-end flex-grow">
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
