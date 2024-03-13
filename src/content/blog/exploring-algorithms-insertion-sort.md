---
title: "Exploring Algorithms: Insertion sort in Rust"
pubDate: 2024-03-13
description: "An exploration in to how the insertion sort algorithm works"
tags: ["algorithms", "rust"]
---

As a recent effort to improve my Computer Science fundamentals I decided to learn more about 
algorithms, how they work, how to prove their correctness and how to measure their efficiency.
I've used different types of reference material for this and have left links where appropriate.

### Notes on the implementation
To explore this algorithm I'll be writing an implementation in Rust, but I will not be using
the standard library and I will also implement some built in functions myself in order to fully
understand what the algorithm is doing, but I will compare my implementation to a more idiomatic
solution as well. Additionally, Rust's borrow checker gives me some nice guard rails to both 
understand how the memory is behaving while stopping me from doing stupid things. It's also a nice
exercise to learn more about the language.

## Insertion sort
The insertion sort is _"an efficient algorithm for sorting a small number of elements"_[^1]. A common 
way to describe it would be how you would sort playing cards if you started with a pile of mixed card,
and an empty hand. Every time you pick up a card you would insert it into the correct poistion so that
the cards you're holding are always sorted. While this is a nice example (it goes well with the name of
the algorithm), it didn't help me really visualize how the algorithm works. But let's start with defining
what is suppoed to happen in the first place:

$$
\begin{align*}
\text{Input: }\quad & \langle a_1, a_2, \cdots a_n \rangle \\
\text{Output: }\quad & \langle a'_1, a'_2, \cdots a'_n \rangle
\end{align*}
$$

where the output is a permutation (read: reordering) such that every element in the array is in order,
from smallest to largest:
$$
a'_1 \leq a'_2 \leq \cdots a'_n
$$

Arguably there are actually 2 inputs, the first one being the sequence, the second one, $n$, being the
length of the sequence, but because in all programming languages I know this can be trivially calculated
from the array/list/vector/slice itself.

I asked ChatGPT to generate some pseudocode for the algorithm because I was too lazy to come up with a 
good balance of aestetic and readability myself. I think it did a pretty good job:

```c
Procedure InsertionSort(A[0..n-1])
    Input: An array A[0..n-1] of n elements
    Output: Array A[0..n-1] sorted in nondecreasing order

    for i ← 1 to n-1 do
        key ← A[i]
        // Insert A[i] into the sorted sequence A[0..i-1]
        j ← i - 1
        while j ≥ 0 and A[j] > key do
            A[j + 1] ← A[j] // Move elements of A[0..i-1], that are
                            // greater than key, to one position ahead
                            // of their current position
            j ← j - 1
        A[j + 1] ← key
    end for
end Procedure
```

The interesting point to note here is that we make use of a _*subarray*_, or sorted squence as it's
called in the pseudocode. In the common playing cards example, this subarray represents our hand.
In the example we would naturally start off with an empty hand and fill it as we pick up cards,
but when we write the algorithm we start off with the first two elements of the array (the minimum 
amount of elements needed to sort), in the pseudo code we can see this because we start at index 1.

In this example the subarray is not intuitive to track but it's an implicite slice of the input, 
where `i` acts as a marker to increase it's upper bound. After every iteration of the loop `i` increases
which in turn increases the subarray as well.

The value at this marker gets assigned to a variable `key` with the goal of finding the correct position
to insert it into the array (I guess that's where the name comes from).

In order to find this position we follow some rules (read: conditions for the inner loop):
- We ensure that we don't underflow the array by checking `j` is not negative.
- We check that the previous element, `A[j]` is greater than `key`, if it isn't then we are already at a valid position where we can insert `key`

If we fall withing these rules we moving elements to the right (we are swapping elments upwards), 
and decrementing `j`. Once we no longer meet the conditions for the inner loop, we have arrived 
at a suitble insertion point and can bind the `key` to that point in the array.


## Implementation
Let's write a very naive implementation that follows the pseudocode as closely as possible:

```rust
fn insertion_sort<T>(arr: &mut [T])
where
    T: Ord + Copy,
{
    let n = arr.len();
    for i in 1..n {
        let key = arr[i];
        let sub_arr = &mut arr[0..=i];
        let mut j = i as isize - 1;

        while j >= 0 && sub_arr[j as usize] > key {
            sub_arr[(j + 1) as usize] = sub_arr[j as usize];
            j -= 1;
        }

        sub_arr[(j + 1) as usize] = key;
    }
}
```
Now, I know what you're thinking: "This looks like terrible code! Too much type casting! There are many
better ways to do this!" And you're right, this is pretty bad to look at and there is probably a better
way to write this. But before we refactor this, let's examine how the Rust codes works. 
I'll start at the beginning, with the function signature.

### Function signature
Since insertion sort operates on a sequence in place, I will use a slice, `[T]`, since slices seem to be a 
good data structure to work with portions of data. 

The `Ord`  trait ensures that elements of the slice can be ordered in some way (a handy thing if you need 
to sort things!).

The `Copy` trait is required because we need a way to bind the value at `arr[i]` to a variable. This trait
is implemented by default on primitive types, but since the signature is generic over `T` we need to be
explicit in telling the compiler that elements of the slice are copyable.

### Function body
The function body itself, as mentioned, follows the pseudocode implementation quite closely. Let's start with
the elephant(s) in the room: all those type casts. 

I'll be honest, this kind of confused me and if you're like me and come from a TypeScript background,
this might be new to you as well. Unlike in many other languages, in Rust indexing into slices and vectors
can only be done with the `usize` type (which is unsigned and therefore can never be negative). Easy enough.
However since we also perform some arithmatic on `j`, we need to also cast this to a signed version `isize`
but since we also check that `j` can never actually be 0 we cast it back to `usize`.

The other thing you may have noticed is that I explicitly added a `sub_arr` variable. I did this to make it
very clear that we are operating on a subarray of the input sequence. Both `arr` and `sub_arr` point to the
same space in memory, which means an mutating operation of one affects the other. It also means that it's
completely redundant to do it this way, but it helped me understand how things worked.

Now that we understand how the rust implementation work let's refactor it slighly to get rid of those annoying
type casts:

```rust
fn insertion_sort<T>(arr: &mut [T])
where
    T: Ord + Copy,
{
    for i in 1..arr.len() {
        let sub_arr = &mut arr[0..=i];
        let mut j = i;

        #[allow(clippy::manual_swap)]
        while j > 0 && sub_arr[j] < sub_arr[j - 1] {
            let tmp = sub_arr[j];
            sub_arr[j] = sub_arr[j - 1];
            sub_arr[j - 1] = tmp;
            j -= 1;
        }
    }
}
```

In this iteration we take advantage of some of the power of the rust compiler to avoid the various type casts.
The condition of our loop has changed to ensure it is always greater than 0 which means the compiler knows that `j`
after this point can never be an invalid value for indexing the slice.

As you may have noticed by the supressed clippy warning, we are also re-inventing the wheel here by doing a manual swap operation. 
Using swap here provides use with a nicer and (in my opinion) more readable way to reason about the code: 
if `sub_arr[j] < sub_arr[j - 1]` then swap them. Keep doing that until you arrive at a valid insertion point.

Since we are using this approach we no longer need the `key` variable. Since we are now directly operating on the slice
we no longer need to manually insert the `key`.

Finally here is the most _idiomatic_ solution I could come up with that implements insertion sort:

```rust
fn insertion_sort<T>(arr: &mut [T])
where
    T: Ord + Copy,
{
    for i in 1..arr.len() {
        let mut j = i;

        while j > 0 && arr[j] < arr[j - 1] {
            arr.swap(j, j - 1);
            j -= 1;
        }
    }
}
```
Here we got rid of the explicit and redundant `sub_array` and are also using the built in method for swapping elements
like normal people would.

### Conclusion
Looking at the implementation of this algorithm I can understand why it's best used on relatively small datasets (I am puerly
going on my understangin of how computers work, I did not do any actual benchmarking), since we are iterating over each
element, and re-assigning elements every time. 

In the worst case (where none of the elements are in order), insertion sort it could have a time complexity of: $O(n^2)$ 
where $n$ is the length of the input sequence.

The algorithm operates on a subarray of the input, which means it has a nested loop which means as the input grows larger,
the number of operations increases quadratically.

However, since the algorithm only swaps adjecent elements in memory (which I think has a realtively small overhead), 
I think it could still be useful for datasets that are _almost_ sorted or simply very small.

## References
[^1]: Cormen, T.H. et al. (2022) Introduction to Algorithms, fourth edition. MIT Press, p.18
- https://codereview.stackexchange.com/questions/141946/insertion-sort-in-rust
