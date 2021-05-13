import pandas as pd
xMap={
        "education":"Education",
        "marital_status":"Marital_Status",
        "income_groups":"Income_groups",
        "age_group":"age_range"
    }
yMap={
    "all":"AmntAll",
    "wine":"AmntWines",
    "fruits":"AmntWines",
    "meat":"AmntWines",
    "fish":"AmntFishProducts",
    "sweet":"AmntSweetProducts",
    "gold":"AmntGoldProds"
}

def getBarData(countryId,barX,barY,xSubCategory):
    df=pd.read_csv('./data/marketing_updated_new.csv')
    if countryId!='all':
        df=df[df['Country'] == countryId]
    dataList=[]
    barX = xMap[barX]
    barY = yMap[barY]
    barX_label = df[barX].unique()
    count = 0
    groupcols = df.groupby(barX)
    grouped = groupcols.mean().round(2)[barY]
    for i in range(len(grouped)):
        dataList.append({"label" : barX_label[i], "count": grouped[i]})
    return dataList

def getPieData(countryId,barX,barY,xSubCategory):
    df=pd.read_csv('./data/marketing_updated_new.csv')
    if countryId!='all':
        df=df[df['Country'] == countryId]
    data={}
    barYCols = ['AmntWines','AmntFruits','AmntMeatProducts','AmntFishProducts','AmntSweetProducts','AmntGoldProds']
    count = 0
    xSubcategoryVals = df[xMap[barX]].unique()
    groupcols = df.groupby(xMap[barX])
    grouped = groupcols.mean().round(2)[barYCols]

    for index, row in grouped.iterrows():
        if index in xSubcategoryVals:
            data[index] =[]
            for i in barYCols:
                data[index].append({'label': i, 'count': row[i] })
    return data


def formResponse(countryId,barX,barY,xSubCategory):
    data={}
    
    param={
	"marital_status":[{"label":"Married","count":36},{"label":"Together","count":29},{"label":"Single","count":23},{"label":"Divorced","count":48},{"label":"Widow","count":12}],
	"education":[{"label":"Graduation","count":26},{"label":"PhD","count":24},{"label":"2n Cycle","count":53},{"label":"Master","count":78},{"label":"Basic","count":42}],
	"age_group":[{"label":"25-35","count":63},{"label":"36-45","count":20},{"label":"46-55","count":16},{"label":"56-65","count":29},{"label":"65+","count":58}]
}
    data={
		"pie":{
		"Graduation":[{"label":"wine","count":30},{"label":"fruits","count":20},{"label":"meat","count":10}],
		"PhD":[{"label":"wine","count":20},{"label":"fruits","count":50},{"label":"meat","count":30}],
		"Master":[{"label":"wine","count":10},{"label":"fruits","count":40},{"label":"meat","count":20}],
		"Basic":[{"label":"wine","count":30},{"label":"fruits","count":60},{"label":"meat","count":10}],
        "2n Cycle":[{"label":"wine","count":20},{"label":"fruits","count":40},{"label":"meat","count":80}]
		}
	}

    data["bar"] = getBarData(countryId,barX,barY,xSubCategory)
    data["pie"] = getPieData(countryId,barX,barY,xSubCategory)
    data["pcp"] = getPcpData(countryId,barX,barY,xSubCategory)
    print("data is ")
    print(data)
    return data

def formScatterPlotResponse(countryId,barX,barY,xSubCategory):
    data={}
    df=pd.read_csv('./data/marketing_updated_new.csv')
    if countryId!='all':
        df=df[df['Country'] == countryId]
    # barX="marital_status"
    # barY="meat"
    xMap={
        "education":"Education",
        "marital_status":"Marital_Status",
        "income_groups":"Income",
        "age_group":"Age"
    }
    yMap={
        "all":"AmntAll",
        "wine":"AmntWines",
        "fruits":"AmntWines",
        "meat":"AmntWines",
        "fish":"AmntFishProducts",
        "sweet":"AmntSweetProducts",
        "gold":"AmntGoldProds"
    }
    barX=xMap[barX]
    barY=yMap[barY]
    scatterList=[]
    for i,row in df.iterrows():
        temp={}
        temp["xVal"]=row[barX]
        temp["yVal"]=row[barY]
        scatterList.append(temp)
    data["scatter"]=scatterList
    return data

def getPcpData(countryId,barX,barY,xSubCategory):
    mapLabel={'Age':'Age','Education':'Education','Marital_Status':'Marital Status','Income':'Income','AmntWines':'Wine','AmntFruits':'Fruit','AmntMeatProducts':'Meat','AmntFishProducts':'Fish','AmntGoldProds':'Gold','Country':'Country','age_range':'Age Group','Income_groups':'Income Groups','ClusterId':'ClusterId'}
    col_names=['Country','Age','age_range', 'Education','Marital_Status','Income','Income_groups','AmntWines','AmntFruits','AmntMeatProducts','AmntFishProducts','AmntGoldProds','ClusterId']

    df = pd.read_csv('./data/marketing_updated_new.csv')
    if countryId!='all':
        df=df[df['Country'] == countryId]
    dataList=[]
    for index, row in df.iterrows():
        temp={}
        for i in col_names:
            temp[mapLabel[i]]=row[i]
        dataList.append(temp)
    return dataList
