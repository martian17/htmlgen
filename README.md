# HTMLGen - A JavaScript centered DOM library
This is a light weight DOM wrapper library that was created to speed up web development. 
It is intended to be as low level as possible, while providing shortcuts and concise syntax to 
seamlessly incorporate HTML elements into your JavaScript logic (and yes, not the other way around).  

## Memory integrity over Reactivity
You are a programmer, and you deserve the right to your pointer. Once you create an element,  
it won't unmount unless you tell it to do so. This allows us to have a clearer picture of 
what goes on under the hood, and perform complex manipulation without the cost of re-renders.

## No React shenanigans, no re-renders, no automatic DOM unmounting
The main difference between this library and other mainstream web frameworks, is that 
this library is centered around JavaScript, and not HTML. Therefore, there is no 
concept of reactivity, and everything is object oriented.  
This allows programmers to safely store states inside each objects, and animation is 
as easy as manipulating the style based on the current time. No `useEffect()` necessary!


## Docs and API
Read d.ts :p
