import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: any;
    // { api_user_id: string; exam_id: string }
  },
) {
  try {
    const { api_user_id, exam_id } = await params;

    if (!api_user_id || !exam_id) {
      return NextResponse.json(
        { message: 'User ID is missing from the request path' },
        { status: 400 },
      );
    }

    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    // Get all query parameters from the original request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    /**
     * sample response:{
          "success": true,
          "data": {
              "questions": [
                  {
                      "quiz_question_id": "156fc20b-cf18-4e8f-a8a3-b4f35fe7d327",
                      "question_body": "Which Google Cloud service provides a fully managed environment for running containerized applications without needing to manage the underlying infrastructure like GKE clusters?",
                      "difficulty": "Intermediate",
                      "topic_id": 1,
                      "cert_id": 2,
                      "exam_question_id": "642a9442-8052-4612-83ff-92ece9a3d4cb",
                      "selected_option_id": null,
                      "answerOptions": [
                          {
                              "option_id": "d2d0a4fb-1413-44a3-9307-3189061ff70c",
                              "option_text": "Compute Engine"
                          },
                          {
                              "option_id": "20204311-24c5-470b-b250-2970cae01d4d",
                              "option_text": "Cloud Run"
                          },
                          {
                              "option_id": "46313806-b6b7-45e1-80b9-1eca3735425b",
                              "option_text": "App Engine Standard"
                          },
                          {
                              "option_id": "08816a9b-667c-44cb-92fe-8c37786629c2",
                              "option_text": "Bare Metal Solution"
                          }
                      ]
                  },
              ]
          },
          "pagination": {
              "currentPage": 1,
              "pageSize": 10,
              "totalItems": 20,
              "totalPages": 2
          }
      }
     */
    const USER_EXAMS_API_URL = `${
      process.env.NEXT_PUBLIC_SERVER_API_URL
    }/api/users/${api_user_id}/exams/${exam_id}/questions${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(USER_EXAMS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to fetch exams for user ${api_user_id}:`, response.status, errorData);
      return NextResponse.json(
        { message: `Failed to fetch exams for user ${api_user_id}`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching user exams:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { message: 'Error fetching user exams', error: errorMessage },
      { status: 500 },
    );
  }
}
