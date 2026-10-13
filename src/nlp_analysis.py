from vaderSentiment.vaderSentiment import (
    SentimentIntensityAnalyzer
)


def analyze_sentiment(news):

    analyzer = (
        SentimentIntensityAnalyzer()
    )

    if news.empty:

        return news, {
            "average": 0,
            "positive": 0,
            "negative": 0,
            "neutral": 0
        }

    news = news.copy()

    news["Text"] = (
        news["title"]
        .fillna("")
        + " "
        +
        news["description"]
        .fillna("")
    )

    news["Sentiment"] = (
        news["Text"]
        .apply(
            lambda text:
            analyzer
            .polarity_scores(text)
            ["compound"]
        )
    )

    def classify(score):

        if score >= 0.05:
            return "Positive"

        elif score <= -0.05:
            return "Negative"

        else:
            return "Neutral"

    news["Sentiment_Label"] = (
        news["Sentiment"]
        .apply(classify)
    )

    average = (
        news["Sentiment"]
        .mean()
    )

    summary = {

        "average": average,

        "positive": int(
            (
                news["Sentiment_Label"]
                == "Positive"
            ).sum()
        ),

        "negative": int(
            (
                news["Sentiment_Label"]
                == "Negative"
            ).sum()
        ),

        "neutral": int(
            (
                news["Sentiment_Label"]
                == "Neutral"
            ).sum()
        )
    }

    return news, summary