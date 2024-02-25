---
title: 'Using type narrowing as array filters in Typescript'
pubDate: 2024-02-25
description: 'How to use type narrowing to correclty filter a collection of objects in TypeScript'
tags: ['typescript']
---

Sometimes you have a collection of objects that contain some optional properties.
This can be a problem if you need to retrieve object based on there optional
values. Take this example:

```ts
type Cat = {
  age: number;
  name?: string;
};

const cat1 = {
  name: 'Garfield',
  age: 3,
};

const cat2 = {
  name: 'Puss In Boots',
  age: 5,
};

const cat3 = {
  age: 4,
};

const cats = [cat1, cat2, cat3];
```

if you need to get all the cats that are lucky enough to have a name, you might
intuitively do something like this:

```ts
const filteredCats = cats.filter(cat => !!cat.name);
```

However you will quickly notice that the compiler will not allow you to do this.
TypeScript is smart enough to know that it can't process data that is optional on some
objects in the array:

```
Property 'name' does not exist on type '{ age: number; }'.(2339)
```

One way to get around this is to explicitly declare `cats` to be an array of `Cat`:

```ts
const cats: Cat[] = [cat1, cat2, cat3];
```

This will keep the compiler happy and it can be good enough if we just need to return
those values. But if we need this data for further processing (e.g. mapping
after filtering) this still won't work. For example:

```ts
filteredCats.map(cat => cat.name.split()); // Object is possibly 'undefined'.(2532)
```

How can we get around this? Since the compiler can't dynamically create new types,
we need to handle this. A good way to do this is via TypeScript
[type narrowing]('https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards')

### Niche helper function

In order to tell TypeScript that we want to filter for cats that have a name we can
use [type predicates]('https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates')
where we tell the compiler exactly what shape the returned object needs
to be using the type predicate syntax:

```ts
function catWithName(
  cat: Cat
): cat is Omit<Cat, 'name'> & Required<Pick<Cat, 'name'>> {
  return !!cat.name;
}
```

Let's look at what this actually does. Type predicates let us create user defined
type guards, similar to the standard type guards we have for primitives in JavaScript
like `typeof x === 'string'`. With the above function the compiler will know that
anything `cat` that gets given to this function must have a name property. With this
we can achieve our goal of filtering only for cats that have names:

```ts
const filteredCats = cats.filter(catWithName);
```

While this is fine, it would be good to use a utility function that works on any collection
of objects, not just cats. With type predicates and some cool use of generics we can
do just that:

### All-purpose helper function

```ts
type PropertyNotNullable<T, TKey extends keyof T> = T & {
  [P in TKey]-?: NonNullable<T[P]>;
};

function propertyIsNotNullOrUndefined<T, TKey extends keyof T>(key: TKey) {
  return function (obj: T): obj is PropertyNotNullable<T, TKey> {
    return obj[key] !== null && typeof obj[key] !== 'undefined';
  };
}
```

Let's look at what this actually does: Our function takes 1 argument: `key` (`TKey`) which is
a property of whichever object (`T`) our function is generic over. We then
return another function that acts as predicate similar to the previous example, but
instead of checking for a specific property like we did before with `name`, we use
a standard JavaScript type guard to ensure the property is not `null` or `undefined`.

<br />

The type that we define also has some funky stuff going on. Similar to the function,
the type is generic over an object(`T`) and it's keys (`TKey`). However using
[mapped type modifiers]('https://www.typescriptlang.org/docs/handbook/release-notes/overview.html#improved-control-over-mapped-type-modifiers')
we can remove the optionality identifier (the `?`) with the `-`. The
type then is equal to the object `T` but overrides every key with a new type `P`
that is no longer optional and returns a non-nullable value (So this were to also
work if the `name` property in `Cat` was `name: string | undefined`).

<br />

We can then use this function to filter any array of objects for truthy properties,
based on the key we pass it and since we are passing this as a reference to `filter`
we don't have to declare what `propertyIsNotNullOrUndefined` is generic over and
since the compiler knows that our argument has to be a property of whatever it is
generic over, we even get that sweet auto-complete.

```ts
filteredCats = cats.filter(propertyIsNotNullOrUndefined('name'));
```

We can now continue processing the `cats` array:

```ts
const filteredCats = cats
  .filter(propertyIsNotNullOrUndefined)
  .map(cat => cat.name.split()); // this now works
```

By the way this also works for arrays that where each item can be `null` or `undefined`:

```ts
function isNotNullOrUndefined<T>(val: T): val is NonNullable<T> {
  return val !== null && typeof val !== 'undefined';
}
```
