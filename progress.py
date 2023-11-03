
word1 = ['a', 'f', 'g']
word2 = ['g', 'h', 't']
## output list
output = []
## loop through the words
for i in word1:
    
    for j in word2:
        output += i, j
        # output += j
print(output)