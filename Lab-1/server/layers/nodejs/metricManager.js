// Import AWS SDK and SST libraries
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";

// const cloudwatch = new CloudWatch();

export const recordMetric = async (event) => {
  const tenantId = event.requestContext?.authorizer?.tenantId;

  if (!tenantId) {
    console.error("Tenant ID not found in the event context");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Tenant ID is missing." }),
    };
  }

  const { metricName, metricUnit, metricValue } = JSON.parse(
    event.body || "{}"
  );

  if (!metricName || !metricUnit || metricValue === undefined) {
    console.error("Metric details are incomplete");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Metric details are incomplete." }),
    };
  }

  const params = {
    Namespace: "CustomNamespace",
    MetricData: [
      {
        MetricName: metricName,
        Dimensions: [
          {
            Name: "tenant_id",
            Value: tenantId,
          },
        ],
        Unit: metricUnit,
        Value: metricValue,
      },
    ],
  };

  try {
    await cloudwatch.putMetricData(params).promise();
    console.log("Metric recorded successfully", params);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Metric recorded successfully." }),
    };
  } catch (error) {
    console.error("Error recording metric", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to record metric." }),
    };
  }
};
