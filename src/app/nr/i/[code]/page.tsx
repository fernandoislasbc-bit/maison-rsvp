import InvitationClient from './invitation-client';

type Props = { params: Promise<{ code: string }> };

export default async function NrInvitationPage({ params }: Props) {
  const { code } = await params;
  return <InvitationClient code={decodeURIComponent(code)} />;
}
