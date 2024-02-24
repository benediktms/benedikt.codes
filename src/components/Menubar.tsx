import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./ModeToggle";
import { Link } from "./ui/link";

export const Menubar = () => {
  return (
    <NavigationMenu className="my-3 w-full min-w-full">
      <NavigationMenuList>
        <div className="flex justify-between items-center w-full">
          <NavigationMenuItem className="md:w-96 xs:w-48">
            <a className="text-3xl mr-10 hover:underline" href="/">
              <NavigationMenuLink>Bengineering</NavigationMenuLink>
            </a>
          </NavigationMenuItem>
          <div className="flex">
            <NavigationMenuItem>
              <Link href="/blog" className="mr-3">
                <NavigationMenuLink>blog</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" className="mr-3">
                <NavigationMenuLink>about</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>
          <NavigationMenuItem>
            <ModeToggle />
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
