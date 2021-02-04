

## C#委托的介绍(delegate、Action、Func、predicate)
委托是一个类，它定义了方法的类型，使得可以将方法当作另一个方法的参数来进行传递。事件是一种特殊的委托。

类似c++的函数指针，但是他是类型安全的，
1. 允许将方法作为参数传递。
2. 可用于定义回调方法。
3. 委托可以链接在一起。例如，可以对一个事件调用多个方法。

## delegate 

委托的关键字是 **delegate**,一个委托相当于一个新的类，可使用访问修饰符 public、private、protected等，作用域同类的修饰符.

定义了委托类型与参数,使得可以将方法当作另一个方法参数来传递。事件是一种特殊的委托。

 Delegate至少0个参数，至多32个参数，可以无返回值，也可以指定返回值类型。
  
定义一个委托，有二个参数，并返回Int类型的值。
```csharp
    delegate int CalculateMethodInvoker(int a, int b);
```

定义方法,方法参数与返回值与委托保持一致
```csharp
    public class CalculateHelper
    {
        public static int Sum(int x, int y)
        {
            return x + y;
        }
        public static int Multiply(int x, int y)
        {
            return x * y;
        }
    }
```

调用
```csharp
class Program
{
    static void Main(string[] args)
    {
        CalculateMethodInvoker calculateSumInvoker = CalculateHelper.Sum;
        CalculateMethodInvoker calculateSumInvoker2 = new CalculateMethodInvoker(CalculateHelper.Sum);//实例化一个委托
        CalculateMethodInvoker calculateMultiplyInvoker = CalculateHelper.Multiply;

        int x = 20, y = 10;

        int addResult = calculateSumInvoker(x, y);
        int addResult2 = calculateSumInvoker2(x, y);
        int invokeResult = calculateSumInvoker.Invoke(x, y);

        Console.WriteLine($"x,y相加，得到{addResult},{addResult2},{invokeResult}");
        Console.WriteLine($"x,y相乘，得到{calculateMultiplyInvoker(x,y)}");

        Console.ReadKey();
    }
}
```

一个委托可以将多个方法链接在一起。也可以移除某个方法
```
public static void ContactDelegate()
{
    CalculateMethodInvoker calculateInvoker = CalculateHelper.Sum;
    calculateInvoker += CalculateHelper.Multiply;

    int r1 = calculateInvoker(10, 20);
    Console.WriteLine($"ContactDelegate:{r1}");

    calculateInvoker -= CalculateHelper.Multiply;
    int r2 = calculateInvoker(10, 20);
    Console.WriteLine($"ContactDelegate:{r2}");
}
```


## Action
Action是无返回值的泛型委托。特点是：至少0个参数，至多16个参数，无返回值。

1. 调用方法、可以传入参数
```csharp
public static void ActionParams()
{
    Action<int, int> action = new Action<int, int>(Sum);
    action(1, 2);
}
public static void Sum(int x, int y)
{
    Console.WriteLine($"x+y={x + y}");
}
```
2. 使用lambda表达式
```csharp
public static void ActionLambda()
{
    Action<int, int> action = (x, y) =>
    {
        Console.WriteLine($"x+y={x + y}");
    };
    action(1, 2);
}
```


## Func
Func是有返回值的泛型委托，Func特点：至少0个参数，至多16个参数，根据返回值泛型返回。必须有返回值，不可void  

```Func<int```> 表示无参，返回值为int的委托

```Func<int, int, string>``` 表示传入参数为int, int。 返回值为string的委托

1.调用方法，传入参数
```csharp
public static void FuncMethod()
{
    Func<int, int, int> fc1 = new Func<int, int, int>(CalculateHelper.Sum);
    int result = fc1(1, 2);//调用委托
    Console.WriteLine(result);
}
```

2.使用lambda
```csharp
public static void FuncLambda()
{
    Func<int, int, string> fc = (x, y) => { return (x + y).ToString(); };
    string r = fc(1,2);
    Console.WriteLine(r);
}
```


## Predicate

predicate 是返回bool型的泛型委托

``` predicate<int>``` 表示传入参数为int 返回bool的委托

Predicate有且只有一个参数，返回值固定为bool


1、使用单行lambda,带括号的lambda（可多行代码），独立的方法。都返回bool类型的值。
```csharp
public static void PredicateBoolean()
{
    Point[] points = { 
                new Point(100, 200),
                new Point(150, 250), 
                new Point(250, 375),
                new Point(275, 395),
                new Point(295, 450)
            };
    Predicate<Point> predicate1 = p => p.X * p.Y > 100000;
    Predicate<Point> predicate2 = p =>
    {
        if (p.X * p.Y > 100000)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    Point first = Array.Find(points, ProductGT10);
    Point p1 = Array.Find(points, predicate1);
    Point p2 = Array.Find(points, predicate2);

    Console.WriteLine("Found: X = {0}, Y = {1}", first.X, first.Y);
    Console.WriteLine("Found: X = {0}, Y = {1}", p1.X, p1.Y);
    Console.WriteLine("Found: X = {0}, Y = {1}", p2.X, p2.Y);
    Console.ReadKey();
}
private static bool ProductGT10(Point p)
{
    if (p.X * p.Y > 100000)
    {
        return true;
    }
    else
    {
        return false;
    }
}
```

Array.Find方法，使用Predicate委托搜索Point结构的数组，只有是x和y 字段的乘积大于100000,方法ProductGT10返回true,找到符合要求的元素后停止。


## 事件

**事件自身就是委托类型**，由于委托可以绑定调用多个方法，这会给事件的处理带来方便 。类只需要对外公开事件，就可以与外部的其他地方关联，从而实现事件订阅。

1.由于不同的事件要传递的参数不同，我们通过继承EventArgs，
```csharp
public class KeyPressEventArgs : EventArgs
{
    public ConsoleKey PressdKey { get; private set; }
    public KeyPressEventArgs(ConsoleKey consoleKey)
    {
        this.PressdKey = consoleKey;
    }
}
```

2.

带有泛型参数的事件处理委托。

系统函数内置如下委托

```csharp
public delegate void EventHandler<TEventArgs>(object sender,TEventArgs e);   TEventArgs 是一个泛型参数
```

```csharp
class App
{
    public event EventHandler<KeyPressEventArgs> KeyPressed;
    protected virtual void OnSpaceKeyPressed(KeyPressEventArgs e)
    {
        KeyPressed?.Invoke(this, e);
    }

    public void StartRun()
    {
        while (true)
        {
            ConsoleKeyInfo keyInfo = Console.ReadKey();
            if (keyInfo.Key == ConsoleKey.Spacebar)
            {
                OnSpaceKeyPressed(new KeyPressEventArgs(keyInfo.Key));
            }

            if (keyInfo.Key == ConsoleKey.Escape)
            {
                break;
            }
        }
    }
}

```



```csharp
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("空格：输入当前时间");
        Console.WriteLine("ESC:退出系统");
        
        App app = new App();
        app.KeyPressed += MyApp_SpaceKeyPressed;
        app.StartRun();
    }

    public static void MyApp_SpaceKeyPressed(object sender,KeyPressEventArgs e)
    {
        Console.WriteLine($"{DateTime.Now.ToLongTimeString()}按下空格键,{e.PressdKey.ToString()}");
    }
}

```


## 参考 

- [C#委托的介绍(delegate、Action、Func、predicate)](https://www.cnblogs.com/akwwl/p/3232679.html)
- [c# 定义委托和使用委托（事件的使用）](https://www.cnblogs.com/hjxzjp/p/7667536.html)

