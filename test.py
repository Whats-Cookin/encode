# # name = print("I know your name!!")
# # num = 9
# # print(None == name)
# # print(None == num)

# ## null, undefined, none, None

# ## keyword Arguments and print()


# # import random

# # # num1 = random.randint(1, 10) 
# # # num2 = random.randint(10, 1)

# # print("egg", "john", "son", end=" ")
# # print("egg", "john", "son")
# # print("egg", "john", "son", sep=',')

# # end and sep
# name = "peter" 
# def sellEgg():
#     global eggs ## global scope
#     eggs =200 ## local scope
#     print(eggs)

# sellEgg()
# print(eggs)

# ## exception handling
# å

## exception handling
luckyNum = 3
def luckyGuess(num):
    try:
        print(num/0)
    except:
        print("An error occurred!!")
        
luckyGuess(9)