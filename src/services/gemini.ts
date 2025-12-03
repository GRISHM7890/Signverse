const API_KEY = "AIzaSyBQsFNTpnEtnXENQ7o5pcpVcO7IgvGQ3zs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export interface SignGloss {
    gloss: string;
    description: string;
    leftHandshape: string;
    rightHandshape: string;
    leftPosition: string;
    rightPosition: string;
    leftPalmOrientation: string;
    rightPalmOrientation: string;
    leftFingerDirection: string;
    rightFingerDirection: string;
    movement: string;
    facialExpression: string;
}

export const translateTextToSigns = async (text: string): Promise<SignGloss[]> => {
    const prompt = `
    You are an expert Sign Language Interpreter (ASL).
    Convert the following English text into a sequence of ASL Glosses (Sign Language representation).
    For each gloss, provide a detailed description of the manual and non-manual signals, explicitly separating left and right hand actions.
    
    Input Text: "${text}"
    
    Return ONLY a raw JSON array of objects. Do not include markdown formatting or code blocks.
    Each object must have:
    - "gloss": The ASL gloss (UPPERCASE).
    - "description": A brief description of the sign.
    - "leftHandshape": The shape of the left hand (e.g., "Flat", "Fist", "L", "C", "8", "Point", "None").
    - "rightHandshape": The shape of the right hand (e.g., "Flat", "Fist", "L", "C", "8", "Point", "None").
    - "leftPosition": Starting position of the left hand (e.g., "Chest", "Head", "Neutral").
    - "rightPosition": Starting position of the right hand.
    - "leftPalmOrientation": Direction the left palm faces (e.g., "Forward", "In", "Out", "Up", "Down", "Back").
    - "rightPalmOrientation": Direction the right palm faces.
    - "leftFingerDirection": Direction the left fingers point (e.g., "Up", "Down", "Forward", "Left", "Right").
    - "rightFingerDirection": Direction the right fingers point.
    - "movement": The movement description (e.g., "Hands move apart", "Tap twice").
    - "facialExpression": Required facial expression (e.g., "Neutral", "Eyebrows up", "Frown").

    Example JSON:
    [
      {
        "gloss": "HELLO",
        "description": "Standard greeting.",
        "leftHandshape": "None",
        "rightHandshape": "Flat",
        "leftPosition": "Neutral",
        "rightPosition": "Forehead",
        "leftPalmOrientation": "In",
        "rightPalmOrientation": "Out",
        "leftFingerDirection": "Up",
        "rightFingerDirection": "Up",
        "movement": "Move outward from forehead",
        "facialExpression": "Smile"
      }
    ]
  `;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error Detail:", JSON.stringify(data.error, null, 2));
            throw new Error(data.error.message || "Unknown API Error");
        }

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error("Unexpected API Response Structure:", data);
            throw new Error("Invalid response structure from AI");
        }

        const rawText = data.candidates[0].content.parts[0].text;
        console.log("Gemini Raw Response:", rawText);

        const jsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);
    } catch (error: any) {
        console.error("Gemini Service Error:", error);
        return [
            {
                gloss: "ERROR",
                description: `Translation Failed: ${error.message} `,
                leftHandshape: "None",
                rightHandshape: "Fist",
                leftPosition: "Neutral",
                rightPosition: "Chest",
                leftPalmOrientation: "In",
                rightPalmOrientation: "Back",
                leftFingerDirection: "Down",
                rightFingerDirection: "Up",
                movement: "Shake head",
                facialExpression: "Sad"
            }
        ];
    }
};
