# ============================================================
# FINsight AI - Financial Ratio Analysis
# ============================================================


# ------------------------------------------------------------
# NUMBER CONVERSION
# ------------------------------------------------------------

def convert_number(value):

    try:

        if value in [None, "", "None", "N/A", "NoneType"]:
            return None

        return float(value)

    except (ValueError, TypeError):

        return None


# ------------------------------------------------------------
# CHECK ALPHA VANTAGE API STATUS
# ------------------------------------------------------------

def check_api_status(data):

    if not isinstance(data, dict):
        return None

    # ----------------------------------------
    # Rate limit message
    # ----------------------------------------

    if "Note" in data:

        message = str(data["Note"]).lower()

        if (
            "limit" in message
            or "requests" in message
            or "rate" in message
            or "call frequency" in message
        ):
            return "API limit reached"

    # ----------------------------------------
    # Information message
    # ----------------------------------------

    if "Information" in data:

        message = str(data["Information"]).lower()

        if (
            "limit" in message
            or "requests" in message
            or "rate" in message
            or "call frequency" in message
            or "apikey" in message
            or "api key" in message
        ):

            return "API limit/key issue"

    # ----------------------------------------
    # Invalid API request
    # ----------------------------------------

    if "Error Message" in data:

        return "Invalid API request"

    return None


# ------------------------------------------------------------
# FINANCIAL RATIO ANALYSIS
# ------------------------------------------------------------

def ratio_analysis(
    overview,
    income,
    balance
):

    # ========================================================
    # CHECK API STATUS
    # ========================================================

    statuses = []

    for data in [
        overview,
        income,
        balance
    ]:

        status = check_api_status(data)

        if status:
            statuses.append(status)

    # ========================================================
    # IF API ERROR EXISTS
    # ========================================================

    if statuses:

        # If actual API limit/error exists,
        # don't calculate fake values.

        return {
            "API Status": statuses[0]
        }

    # ========================================================
    # DICTIONARY FOR RATIOS
    # ========================================================

    ratios = {}

    # ========================================================
    # COMPANY OVERVIEW
    # ========================================================

    if isinstance(overview, dict):

        pe = convert_number(
            overview.get("PERatio")
        )

        eps = convert_number(
            overview.get("EPS")
        )

        profit_margin = convert_number(
            overview.get("ProfitMargin")
        )

        operating_margin = convert_number(
            overview.get("OperatingMarginTTM")
        )

        beta = convert_number(
            overview.get("Beta")
        )

        dividend_yield = convert_number(
            overview.get("DividendYield")
        )

        # ----------------------------------------
        # Add only available values
        # ----------------------------------------

        if pe is not None:
            ratios["P/E Ratio"] = pe

        if eps is not None:
            ratios["EPS"] = eps

        if profit_margin is not None:
            ratios["Profit Margin"] = profit_margin

        if operating_margin is not None:
            ratios["Operating Margin"] = operating_margin

        if beta is not None:
            ratios["Beta"] = beta

        if dividend_yield is not None:
            ratios["Dividend Yield"] = dividend_yield

    # ========================================================
    # INCOME STATEMENT
    # ========================================================

    if isinstance(income, dict):

        reports = income.get(
            "annualReports",
            []
        )

        if reports:

            latest = reports[0]

            revenue = convert_number(
                latest.get("totalRevenue")
            )

            net_income = convert_number(
                latest.get("netIncome")
            )

            # Revenue

            if revenue is not None:

                ratios["Revenue"] = revenue

            # Net Income

            if net_income is not None:

                ratios["Net Income"] = net_income

            # Net Profit Margin

            if (
                revenue is not None
                and revenue != 0
                and net_income is not None
            ):

                ratios["Net Profit Margin"] = (
                    net_income / revenue
                )

    # ========================================================
    # BALANCE SHEET
    # ========================================================

    if isinstance(balance, dict):

        balance_reports = balance.get(
            "annualReports",
            []
        )

        if balance_reports:

            latest = balance_reports[0]

            assets = convert_number(
                latest.get("totalAssets")
            )

            liabilities = convert_number(
                latest.get("totalLiabilities")
            )

            current_assets = convert_number(
                latest.get("totalCurrentAssets")
            )

            current_liabilities = convert_number(
                latest.get("totalCurrentLiabilities")
            )

            # Total Assets

            if assets is not None:

                ratios["Total Assets"] = assets

            # Total Liabilities

            if liabilities is not None:

                ratios["Total Liabilities"] = liabilities

            # Debt-to-Asset Ratio

            if (
                assets is not None
                and assets != 0
                and liabilities is not None
            ):

                ratios["Debt-to-Asset"] = (
                    liabilities / assets
                )

            # Current Ratio

            if (
                current_assets is not None
                and current_liabilities is not None
                and current_liabilities != 0
            ):

                ratios["Current Ratio"] = (
                    current_assets /
                    current_liabilities
                )

    # ========================================================
    # NO DATA
    # ========================================================

    if not ratios:

        ratios["API Status"] = (
            "Financial data unavailable"
        )

    # ========================================================
    # RETURN
    # ========================================================

    return ratios