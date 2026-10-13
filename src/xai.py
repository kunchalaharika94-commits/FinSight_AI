def explain_model(model):

    importances = (
        model.feature_importances_
    )

    features = [
        f"Lag_{i}"
        for i in range(
            1,
            len(importances) + 1
        )
    ]

    explanation = sorted(

        zip(
            features,
            importances
        ),

        key=lambda x: x[1],

        reverse=True
    )

    return explanation