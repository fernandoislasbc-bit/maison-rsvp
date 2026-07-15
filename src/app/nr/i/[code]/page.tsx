import { redirect } from 'next/navigation';

type Props = { params: Promise<{ code: string }> };

/* The invitation is the full cinematic experience — this route only
   carries the guest's code into it. */
export default async function NrInvitationPage({ params }: Props) {
  const { code } = await params;
  redirect(`/experiences/neil-and-riley/index.html?code=${encodeURIComponent(decodeURIComponent(code))}`);
}
