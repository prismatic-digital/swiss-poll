import { useMemo } from "react";
import { useForm } from "../../lib/forms";
import {
  getSubmissionAnalytics,
  getSubmissionSummary,
  useSubmissionSessions,
} from "../../lib/submissionSessions";
import { SubmissionSummary } from "../../lib/types";
import { timeSince } from "../../lib/utils";
import AnalyticsCard from "./AnalyticsCard";
import Loading from "../Loading";
import TextResults from "./summary/TextResults";
import ChoiceResults from "./summary/ChoiceResults";
import LikertResults from "./summary/LikertResults";
import { useNoCodeFormPublic } from "../../lib/noCodeForm";

export default function ResultsSummary({ formId, showCards = true }) {
  const { submissionSessions, isLoadingSubmissionSessions } =
    useSubmissionSessions(formId);

  const { form, isLoadingForm } = useForm(formId);
  //const { noCodeForm } = useNoCodeForm(formId);
  const { noCodeForm } = useNoCodeFormPublic(formId);


  const insights = useMemo(() => {
    if (!isLoadingSubmissionSessions) {
      return getSubmissionAnalytics(submissionSessions);
    }
  }, [isLoadingSubmissionSessions, submissionSessions]);

  const summary: SubmissionSummary | undefined = useMemo(() => {
    if (!isLoadingSubmissionSessions && !isLoadingForm) {
      return getSubmissionSummary(submissionSessions, form?.schema);
    }
  }, [isLoadingSubmissionSessions, submissionSessions, isLoadingForm, form]);

  const stats = useMemo(() => {
    if (insights) {
      return [
        {
          id: "totalSubmissions",
          name: "Total Submissions",
          stat: insights.totalSubmissions || "--",
          trend: undefined,
          toolTipText: undefined,
        },
        {
          id: "lastSubmission",
          name: "Last Submission",
          stat: insights.lastSubmissionAt
            ? timeSince(insights.lastSubmissionAt)
            : "--",
          smallerText: true,
          toolTipText: undefined,
        },
      ];
    }
  }, [insights]);

  if (!summary || !insights || !noCodeForm) {
    return <Loading />;
  }
  
  return (
    <>
      {showCards && (
        <>
          <h2 className="mt-8 text-xl font-bold text-ui-gray-dark">
            Responses Overview
          </h2>
          <dl className="grid grid-cols-1 gap-5 mt-8 sm:grid-cols-2">
            {stats.map((item) => (
              <AnalyticsCard
                key={item.id}
                value={item.stat}
                label={item.name}
                toolTipText={item.toolTipText}
                trend={item.trend}
                smallerText={item.smallerText}
              />
            ))}
          </dl>
        </>
      )}
      <div>
        {summary?.pages &&
          summary.pages.map(
            (page) =>
              page.type === "form" && (
                <div key={page.name}>
                  {page.elements.map((element) =>
                    [
                      "email",
                      "number",
                      "phone",
                      "text",
                      "textarea",
                      "website",
                    ].includes(element.type) && element.label != "Autre :" ? (
                      <TextResults element={element} />
                    ) : ["checkbox", "radio"].includes(element.type) ? (
                      <ChoiceResults element={element} colors={noCodeForm.chartColors.colors} />
                    ) : ["likert"].includes(element.type) ? (
                      <LikertResults element={element} colors={noCodeForm.chartColors.colors} />
                    ) : null
                  )}
                </div>
              )
          )}
      </div>
    </>
  );
}
