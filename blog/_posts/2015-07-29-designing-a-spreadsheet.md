---
title: Designing a spreadsheet
tags: []
---
At an interview today, I was asked to design a spreadsheet application. I grabbed the pen and paper and rushed headfirst into how I would store everything, support different features I thought of on the spot, and iterated my design a few times. It was an interesting problem, and I thought I would write about it quickly.

# The Requirements

The original task didn't come with any requirements aside from "spreadsheet", but I'm going to set a few for myself:

* Memory efficiency - you shouldn't need a supercomputer to run this
* Computational efficiency - it shouldn't take forever to refresh just because you changed a cell that's referenced in every single formula in the entire spreadsheet.
* Moving cells should preserve the reference
* Strong type system for formulas

For brevity's sake, I'm only going to include the parts that change in between each design iteration (so you'll have to read to make sense of it).

# My initial design

The first design I put down was simple:

~~~
Sheet
  - cells:Cell[][]

Cell
  - value:String
~~~

Mind you, this initial design doesn't even support formulas, but it gets stuff on the screen. It's "good enough" to start from. Next up, let's improve our memory efficiency:

~~~
Sheet
  - Hash[cellAddress -> Cell]
~~~

Where cellAddress is a string like "A1". That's better. Now we don't need to keep a million objects live in the heap for a spreadsheet with 1 number in it. Of course, we still can't resize it or remove rows/columns:

~~~
Sheet
  - Hash[cellAddress -> Cell]
  - Hash[cellRow -> cellAddress[]]
  - Hash[cellColumn -> cellAddress[]]
  - size:Number,Number
  + addColumn(before)
  + addRow(before)
  + removeColumn(which)
  + removeRow(which)
~~~

Where cellRow is something like "1", and cellColumn is something like "A". The naive approach would be to simply iterate through all possible addresses, but that might get tedious. Also, you don't want to have a situation where you're remove a row with one filled cell in it and have to wait because you have 100000 other cells in the table.

# Supporting formulas

At first, let's just support the simplest formula: a reference. Basically, typing into a cell something like this: "=A1".

~~~
Cell (abstract)
  - source:String
  + eval():String
ValueCell < Cell
FormulaCell < Cell
  - state:enum (valid, SyntaxError)
~~~

The idea being that a ValueCell simply returns its value for eval, whereas a formula cell finds the Cell it references and returns its eval(). Now, let's make changes fast, so if you have a bunch of references in your sheet, you don't have to invalidate all of them:

~~~
CellObserver (contract)
  + cellChanged(cell, oldValue, newValue)
  + cellMoved(cell, oldAddress, newAddress) # newAddress is null if the cell is being deleted
Cell (abstract)
  - observers:CellObservers[]
  + observe(CellObserver)
  + stopObserving(CellObserver)
FormulaCell < Cell, CellObserver
  - observing:Cell[]
~~~

Where the eval() of a FormulaCell can easily be memoized to propogate changes efficiently. Note that this also solves the problem of tracking cells being moved around (via copy paste or rows/columns being added/removed). All of this is nice, but we still don't have formulas more useful than a simple reference. For that, we'll want to introduce our formula parser:

~~~
Value (abstract)
  + display():String
StringValue < Value
  - value:String
NumberValue < Value
  - value:Number
ErrorValue < Value
  - which:enum (TypeError, SyntaxError, MathError, etc)
ReferenceValue < Value, CellObserver
  - observing:Cell
  - parent:Cell # used to modify the source of the formula if the target is moved
  - sourceOffset:Number
Expression (abstract)
  + eval():Value
  + arity():Number
  - operands:Expression/Value[]
Addition < Expression
  # addition only works if both operands are Numbers. Otherwise, it will return a TypeError
Concatenation < Expression
  # -1 variable arity, but only works if both operands are Strings. Otherwise it will return an ErrorValue(Type)
FormulaCell < Cell
  - formula:Expression
~~~

This shows how some simple operators (addition and concatenation) are supported. Along the way, note the ReferenceValue, which allows for rapid recomputation, and that FormulaCell no longer observes Cells directly. Chances are that you'll want to build a small Parser/Factory class tree for Cells, but that's out of the scope of this initial design (given that most of the functional design patterns like that are typically best built on an adhoc basis during or after initial development).

# Altogether:

~~~
Sheet
  - Hash[cellAddress -> Cell]
  - Hash[cellRow -> cellAddress[]]
  - Hash[cellColumn -> cellAddress[]]
  - size:Number,Number
  + addColumn(before)
  + addRow(before)
  + removeColumn(which)
  + removeRow(which)

CellObserver (contract)
  + cellChanged(cell, oldValue, newValue)
  + cellMoved(cell, oldAddress, newAddress) # newAddress is null if the cell is being deleted
Cell (abstract)
  - source:String
  + eval():String
  - observers:CellObservers[]
  + observe(CellObserver)
  + stopObserving(CellObserver)
FormulaCell < Cell
  - formula:Expression
  - observing:Cell[]
ValueCell < Cell

Value (abstract)
  + display():String
StringValue < Value
  - value:String
NumberValue < Value
  - value:Number
ErrorValue < Value
  - which:enum (TypeError, SyntaxError, MathError, etc)
ReferenceValue < Value, CellObserver
  - observing:Cell
  - parent:Cell # used to modify the source of the formula if the target is moved
  - sourceOffset:Number
Expression (abstract)
  + eval():Value
  + arity():Number
  - operands:Expression/Value[]
Addition < Expression
  # addition only works if both operands are Numbers. Otherwise, it will return a TypeError
Concatenation < Expression
  # -1 variable arity, but only works if both operands are Strings. Otherwise it will return an ErrorValue(Type)
~~~

There are still many ways you can move forward with this, and there's a lot left if you want to style the values in the sheet, but this is a good start. Of course, I would argue that it's better to provide a table editor for people and allow them to setup calculated fields. This would be more akin to MS Access, but the UX could be so much better now with modern technology and UI design.
