import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
books = pd.read_csv('books.csv')
print(books.head())

print(books['Rating'].corr(books['Price']))
sns.lineplot(books, x='Rating', y='Price')
plt.show()