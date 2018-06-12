# Rematch
作者认为Redux被重写的七个理由:

#### 1. Setup( 格局, 体系)

Let’s take a look at a basic setup from the [real world](https://github.com/reactjs/redux/blob/master/examples/real-world/src/store/configureStore.dev.js) Redux example on the left.

![img](https://cdn-images-1.medium.com/max/1144/1*I5aUT2n8ie90TvMXqx7_MQ.png)

Many developers have paused here, after just the first step, staring blankly into the abyss.(茫然地凝视着深渊) What’s a **thunk**? **compose**? Can a function even **do** that?

Consider if Redux were based on configuration over composition. Setup might look more like the example on the right.

#### 2. Simplified Reducers

Reducers in Redux could use a switch away from the unnecessarily verbose switch statements we’ve grown used to.

![img](https://cdn-images-1.medium.com/max/1144/1*LcEOGpeVlWoc-L0K45zkQQ.png)

Assuming that a reducer is matching on action type, we can invert the params so that each reducer is a pure function accepting state and an action. Maybe even simpler, we could standardize actions and pass in only state and a payload.

#### 4. Async/Await over Thunks(没有3)

**Thunks** are commonly used for creating async actions in Redux. In many ways, the way a thunk works seems more like a clever hack than an officially recommended solution. Follow me here:

1. You dispatch an action, which is actually a function rather than the expected object.
2. Thunk middleware checks every action to see if it is a function.
3. If so, the middleware calls the function and passes in access to some store methods: dispatch and getState.

Really? Is it not bad practice for a simple action to be a dynamically typed as an object, or function, or even a Promise?

![img](https://cdn-images-1.medium.com/max/1144/1*IP9TfDi1WPEeyfPoFuRCMg.png)

Like the example on the right, can’t we just async/await?

#### 5. Two Kinds of Actions

When you think about it, there are really two kinds of actions:

1. **Reducer action**: triggers a reducer and changes state.
2. **Effect action**: triggers an async action. This might call a Reducer action, but async functions do not directly change any state.

Making a distinction between these two types of actions would be more helpful and less confusing that the above usage with “thunks”.

#### 6. No More Action Types As Variables

Why is it standard practice to treat action creators and reducers differently? Can one exist without the other? Does changing one not effect the other?

> Action creators and reducers are two sides of the same coin.

`const ACTION_ONE = 'ACTION_ONE'` is a redundant side effect of the separation of action creators and reducers. (深有同感)Treat the two as one, and there is no more need for large files of exported type strings.

#### 7. Reducers That Are Action Creators

Grouping the elements of Redux by their use, and you’re likely to come up with a simpler pattern.

![img](https://cdn-images-1.medium.com/max/1144/1*bMvxjQuK_oI0Vj4bPFKatA.png)

It’s possible to automagically determine the action creator from the reducer. After all, in this scenario **the reducer can become the action creator**.

Use a basic naming convention, and the following is predictable:

1. If a reducer has a name of “increment”, then the type is “increment”. Even better, let’s namespace it: “count/increment”.
2. Every action passes data through a “payload” key.

![img](https://cdn-images-1.medium.com/max/1144/1*D6r4EQrEQPYFjdoAPJEHSQ.png)

Now from `count.increment` we can generate the action creator from just the reducer.

------