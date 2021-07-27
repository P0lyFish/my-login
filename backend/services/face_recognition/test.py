import os
os.chdir(os.path.dirname(__file__))
import FeatherNet.models as as_models
import torch
from torchvision import transforms
from PIL import Image
import cv2
import numpy as np
import base64
import os.path as osp
import sys
import face_recognition
import warnings
warnings.filterwarnings('ignore')


def toImage(base64Image):
    img_data = base64.b64decode(base64Image)
    nparr = np.fromstring(img_data, np.uint8)
    img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img_np = cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB)

    return img_np


class AntiSpoofing:
    def __init__(self):
        self.net = as_models.FeatherNetB()
        checkpoint = torch.load('FeatherNet/checkpoints/our_pretrained_models/FeatherNetB_bs32/_47_best.pth.tar', map_location='cpu')
        model_dict = {}
        state_dict = self.net.state_dict()
        for (k, v) in checkpoint['state_dict'].items():
            if k[7:] in state_dict:
                model_dict[k[7:]] = v
        state_dict.update(model_dict)
        self.net.load_state_dict(state_dict)

        self.device = torch.device('cpu')
        self.net.eval()
        img_size = 224
        ratio = 224.0 / float(img_size)
        normalize = transforms.Normalize(
            mean=[0.14300402, 0.1434545, 0.14277956],
            std=[0.10050353, 0.100842826, 0.10034215]
        )
        self.transform = transforms.Compose([
            transforms.Resize(int(224 * ratio)),
            transforms.CenterCrop(img_size),
            transforms.ToTensor(), normalize
        ])

    def isReal(self, img):
        small_img = cv2.resize(img, (224, 224))
        pil_im = Image.fromarray(small_img)
        img = self.transform(pil_im)
        img = np.array(img)
        img = np.expand_dims(img, 0)

        input = torch.tensor(img, dtype=torch.float32, device=self.device)
        input = input.to('cpu')
        output_1 = self.net(input)

        soft_output = torch.softmax(output_1, dim=-1)
        _, predicted = torch.max(soft_output.data, 1)
        predicted = predicted.to('cpu').detach().numpy()

        return predicted[0] == 1


if __name__ == '__main__':
    police = AntiSpoofing()

    base64Image = sys.argv[1]
    # with open('img64b.txt', 'r') as f:
    #     base64Image = f.readlines()[0].strip()

    base64Image = base64Image.replace('data:image/jpeg;base64,', '')

    unknown_image = toImage(base64Image)

    unknown_encoding = face_recognition.face_encodings(unknown_image)[0]
    floc = face_recognition.face_locations(unknown_image)[0]
    if not police.isReal(unknown_image[floc[0]: floc[2], floc[3]: floc[1], :]):
        print('null')
        sys.stdout.flush()
        exit()

    known_encodings = []

    all_user_img_names = list(map(
        lambda x: x.name,
        filter(lambda x: x.is_file(), os.scandir('data'))
    ))
    for user_img_name in all_user_img_names:
        if osp.splitext(user_img_name)[1] in ['.png', '.jpg']:
            known_image = face_recognition.load_image_file(f"data/{user_img_name}")

            known_encoding = face_recognition.face_encodings(known_image)[0]
            known_encodings.append(known_encoding)

    results = face_recognition.compare_faces(known_encodings, unknown_encoding)

    found = False
    for user_img_name, result in zip(all_user_img_names, results):
        if result:
            found = True
            print(osp.splitext(user_img_name)[0])
            break

    if not found:
        print('null')

    sys.stdout.flush()
